const winston = require('winston');

module.exports = function (err, req, res, next) {
    res.status(500).send({message: "Something failed at the server."});
    winston.log('error', err.message);
}