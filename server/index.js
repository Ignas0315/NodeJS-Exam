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

console.log(DB_CONFIG);

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

server.get('/groups', async (_, res) => {
    try {
        const [group] = await pool.execute('SELECT * FROM bills_project.groups');
        res.json(group);
    } catch (err) {
        return res.status(500).send(err).end();
    }
});

server.post('/groups', async (req, res) => {
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
        const encryptedPassword = await bcrypt.hash(registrationEntryPayload.password, 10);

        await pool.execute(
            `INSERT INTO bills_project.users (full_name,email,password) VALUES (?,?,?)`,
            [registrationEntryPayload.full_name, registrationEntryPayload.email, encryptedPassword]
        );

        return res.status(201).send('Registration has been successful');
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
            `SELECT * FROM bills_project.users WHERE email = ?`,
            [loginPayload.email]
        );

        // if (!data.length) {
        //     return res.status(400).send({ err: 'Email or password did not match' });
        // }

        // const isPasswordMatching = await bcrypt.compare(payload.password, data[0].password);

        // if (isPasswordMatching) {
        //     const token = jwt.sign(
        //         {
        //             email: data[0].email,
        //             id: data[0].id,
        //         },
        //         process.env.JWT_SECRET
        //     );
        //     return res.status(200).send({ token });
        // }

        if (!loginData.length) {
            return res.status(400).send({ err: 'Email or password did not match' });
        }

        const isPasswordMatching = await bcrypt.compare(loginPayload.password, data[0].password);

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

server.listen(PORT, () => console.log(`Server is running on PORT:${PORT}`));
