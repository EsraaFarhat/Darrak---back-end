const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const {User} = require('../models/user');

const _ = require('lodash');
const express = require('express');

const router = express.Router();


// admin block user account
router.patch('/block/:id', [auth, isAdmin], async (req, res, next) => {
    let id = req.params.id;

    let user = await User.findByIdAndUpdate(
        id, {
            isBlocked: true
        }, {
            new: true,
            useFindAndModify: false
        }
    );

    if (!user) return res.status(404).send({
        message: "User not found."
    });

    res.send({
        message: "This user has been blocked by the admin. "
    });
});


// admin unblock user account
router.patch('/unblock/:id', [auth, isAdmin], async (req, res, next) => {
    let id = req.params.id;

    let user = await User.findByIdAndUpdate(
        id, {
            isBlocked: false
        }, {
            new: true,
            useFindAndModify: false
        }
    );

    if (!user) return res.status(404).send({
        message: "User not found."
    });

    res.send({
        message: "This user has been unblocked by the admin. "
    });
});


module.exports = router;