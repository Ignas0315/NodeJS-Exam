const express = require('express');
const mysql = require('mysql2/promise');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const { authenticate } = require('./middleware/middleware');
const DB_CONFIG = require('./db-config/db-config');

const server = express();
server.use(express.json());
server.use(cors());

const pool = mysql.createPool(DB_CONFIG);

const PORT = process.env.PORT || 8080;

const groupsSchema = Joi.object({
    name: Joi.string().trim().required(),
});

const userRegisterSchema = Joi.object({
    full_name: Joi.string().trim().required(),
    email: Joi.string().email().trim().lowercase().required(),
    password: Joi.string().required(),
});

const userLoginSchema = Joi.object({
    email: Joi.string().email().trim().lowercase().required(),
    password: Joi.string().required(),
});

const accountsSchema = Joi.object({
    group_id: Joi.number().integer().required(),
});

const newBillSchema = Joi.object({
    group_id: Joi.number().integer().required(),
    amount: Joi.number().required(),
    description: Joi.string().trim(),
});

const groupBillsSchema = Joi.object({
    group_id: Joi.number().integer().required(),
});

server.get('/groups', authenticate, async (_, res) => {
    try {
        const [group] = await pool.execute('SELECT * FROM bills_project.groups');
        res.json(group);
    } catch (err) {
        return res.status(500).send(err).end();
    }
});

server.post('/groups', authenticate, async (req, res) => {
    let groupsPayload = req.body;

    try {
        groupsPayload = await groupsSchema.validateAsync(groupsPayload);
    } catch (error) {
        res.status(500).send(error).end();
        return console.error(error);
    }

    try {
        await pool.execute(`INSERT INTO bills_project.groups (name) VALUES (?)`, [
            groupsPayload.name,
        ]);
        res.status(200).send({ message: `${groupsPayload.name} was inserted into groups` });
    } catch (error) {
        res.status(500).send(error).end();
        return console.error(error);
    }
});

server.post('/register', async (req, res) => {
    let registrationEntryPayload = req.body;

    try {
        registrationEntryPayload = await userRegisterSchema.validateAsync(registrationEntryPayload);
    } catch (error) {
        return res.status(400).send({ error: error.message }).end();
    }

    try {
        const encryptedPassword = await bcrypt.hashSync(registrationEntryPayload.password, 10);

        await pool.execute(
            `INSERT INTO bills_project.users (full_name,email,password) VALUES (?,?,?)`,
            [registrationEntryPayload.full_name, registrationEntryPayload.email, encryptedPassword]
        );

        return res.status(201).send({ message: 'Registered' }).end();
    } catch (error) {
        res.status(500).send(error).end();
        return console.error(error);
    }
});

server.post('/login', async (req, res) => {
    let loginPayload = req.body;

    try {
        loginPayload = await userLoginSchema.validateAsync(loginPayload);
    } catch (error) {
        return res.status(400).send({ error: error.message }).end();
    }

    try {
        const [loginData] = await pool.execute(
            `SELECT * FROM bills_project.users WHERE email = (?)`,
            [loginPayload.email]
        );

        if (!loginData.length) {
            return res.status(400).send({ err: 'Email or password did not match' });
        }

        const isPasswordMatching = await bcrypt.compare(
            loginPayload.password,
            loginData[0].password
        );

        if (isPasswordMatching) {
            const token = jwt.sign(
                {
                    email: loginData[0].email,
                    id: loginData[0].id,
                },
                process.env.JWT_SECRET
            );
            return res.status(200).send({ token });
        }
    } catch (error) {}
});

server.post('/accounts', authenticate, async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const decryptToken = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decryptToken.id;

    let postAccountsPayload = req.body;

    try {
        postAccountsPayload = await accountsSchema.validateAsync(postAccountsPayload);
    } catch (error) {
        return res.status(400).send({ error: error.message }).end();
    }

    if (!user_id) {
        res.status(400).send({
            error: 'User ID not provided',
        });
    }

    if (isNaN(user_id) || typeof user_id !== 'number') {
        res.status(400).send({
            error: 'User ID must be integer number',
        });
    }

    if (isNaN(postAccountsPayload.group_id) || typeof postAccountsPayload.group_id !== 'number') {
        res.status(400).send({
            error: 'Group ID must be integer number',
        });
    }

    try {
        const [duplicate_check] = await pool.execute(
            `SELECT * FROM bills_project.accounts WHERE group_id = ? AND user_id= ? `,
            [postAccountsPayload.group_id, user_id]
        );

        if (duplicate_check.length > 1 || duplicate_check.length == 1) {
            return res.send({
                message: 'User and group combination already exists. Try another group.',
            });
        }
    } catch (error) {
        res.status(500).send(error).end();
        return console.error(error);
    }

    try {
        await pool.execute(`INSERT INTO bills_project.accounts (group_id,user_id) VALUES (?,?)`, [
            postAccountsPayload.group_id,
            user_id,
        ]);

        return res.status(201).send({ message: 'User added to the group' });
    } catch (error) {
        res.status(500).send(error).end();
        return console.error(error);
    }
});

server.get('/accounts', authenticate, async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const decryptToken = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decryptToken.id;

    try {
        const [getGroupsOfUser] = await pool.execute(
            `SELECT bills_project.groups.id, bills_project.groups.name FROM bills_project.groups INNER JOIN accounts ON accounts.group_id = bills_project.groups.id WHERE accounts.user_id =(?)`,
            [user_id]
        );

        return res.status(200).send(getGroupsOfUser).end();
    } catch (error) {
        res.status(500).send(error).end();
    }
});

server.get('/bills/:group_id', authenticate, async (req, res) => {
    let billsPayload = req.params;

    try {
        billsPayload = await groupBillsSchema.validateAsync(billsPayload);
    } catch (error) {
        return res.status(400).send({ error: error.message }).end();
    }

    try {
        const [groups] = await pool.execute(
            `SELECT * FROM bills_project.bills WHERE group_id=(?)`,
            [billsPayload.group_id]
        );

        return res.status(200).send(groups).end();
    } catch (error) {
        res.status(500).send(error).end();
        return console.error(error);
    }
});

server.post('/bills', authenticate, async (req, res) => {
    let billsPostPayload = req.body;

    try {
        billsPostPayload = await newBillSchema.validateAsync(billsPostPayload);
    } catch (error) {
        return res.status(400).send({ error: error.message }).end();
    }

    try {
        await pool.execute(
            `INSERT INTO bills_project.bills (group_id, amount, description) VALUES (?,?,?)`,
            [billsPostPayload.group_id, billsPostPayload.amount, billsPostPayload.description]
        );

        res.status(200).send({
            message: `The bill was added to group ${billsPostPayload.group_id}`,
        });
    } catch (error) {
        res.status(500).send(error).end();
        return console.error(error);
    }
});

server.listen(PORT, () => console.log(`Server is running on PORT:${PORT}`));
