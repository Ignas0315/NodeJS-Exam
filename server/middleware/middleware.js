const jwt = require('jsonwebtoken');

module.exports = {
    authenticate: (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).send({ error: 'Unauthorised' }).end();
            }

            const user = jwt.verify(token, process.env.JWT_SECRET);

            req.user = user;
            next();
        } catch (error) {
            console.error(error);

            res.status(401).send({ error: 'Token is bad' });
        }
    },
};
