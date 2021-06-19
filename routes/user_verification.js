const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const { User } = require('../models/user');

const _ = require('lodash');
const express = require('express');

const router = express.Router();

// user request to verify his account
router.patch('/', auth, async (req, res, next) => {
    let id = req.user._id;

    let user = await User.findByIdAndUpdate(
        id,
        { status: "pending" },
        {
            new: true,
            useFindAndModify: false
        }
    );

    if(!user) return res.status(404).send({ message: "User not found." });

    res.send({ message: "Thanks. Your request has been sent to the admin. " });
});

// get all pending users
router.get('/pending_users', [auth, isAdmin], async (req, res, next) => {
    let users = await User.find({ status: "pending" });
    res.send({ users });
});

// admin makes a user verified
router.patch('/verified/:id', [auth, isAdmin], async (req, res, next) => {
    let id = req.params.id;

    let user = await User.findByIdAndUpdate(
        id,
        { status: "verified" },
        {
            new: true,
            useFindAndModify: false
        }
    );

    if(!user) return res.status(404).send({ message: "User not found." });

    res.send({ message: "Account has been verified successfully. " });
});

// reject user request to verify
router.patch('/rejected/:id', [auth, isAdmin], async (req, res, next) => {
    let id = req.params.id;

    let user = await User.findByIdAndUpdate(
        id,
        { status: "not verified" },
        {
            new: true,
            useFindAndModify: false
        }
    );

    if(!user) return res.status(404).send({ message: "User not found." });

    res.send({ message: "Your request to verify has been rejected. Contact us for more information... " });
});

module.exports = router;