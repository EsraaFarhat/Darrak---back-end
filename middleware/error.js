const winston = require('winston');

module.exports = function (err, req, res, next) {
    res.status(500).send({
        message: "Something failed at the server.",
        error: err.message
    });
    winston.log('error', err.message);
}