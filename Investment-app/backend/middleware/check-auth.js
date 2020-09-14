const jwt = require("jsonwebtoken");
const User = require("../models/user");
const logger = require("../helper/logger");

module.exports = (req, res, next) =>{
    const token = req.headers.authorization.replace('Bearer ', '');
    const decoded = jwt.verify(token, "secret_this_should_be_longer");
    User.findOne({ _id: decoded.userId })
    .then(user => {
        logger.info(`${req.method} request from ${user.email} succeded`);
        req.token = token;
        req.user = user;
        next();
    })
    .catch(err => {
        logger.error(`${req} request failed: ${err}`);
        res.status(401).json({message: "Auth failed" });
    })
}