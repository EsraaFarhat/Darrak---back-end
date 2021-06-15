const auth = require("../middleware/auth");
const hasPrivilege = require("../middleware/hasPrivilege");

const { Favourite } = require('../models/favourite');
const { User } = require('../models/user')
const _ = require("lodash");

const express = require('express');


const mongoose = require('mongoose');
const router = express.Router();

router.get('/',auth, async(req, res) => {
    const favourites = await Favourite.find({userFrom: req.user._id});
    res.send({favourites});
});

router.post('/',auth, async(req, res) => {
    const favourite = new Favourite({
        advertismentFrom: req.body.advertismentFrom,
        userFrom: req.user._id
    });
    const newFavourite = await favourite.save();
    res.status(201).json({newFavourite});
});

router.delete('/:id',auth, getFavourites, async(req, res) => {
    await res.favourite.remove();
    res.json({message: 'Favourite deleted'});
});

async function getFavourites(req, res, next) {
    let favourite
    try {
        favourite = await Favourite.findById(req.params.id)
      if (favourite == null) {
        return res.status(404).json({ message: 'Cannot find favourite' })
      }
    } catch (err) {
      return res.status(500).json({ message: err.message })
    }
  
    res.favourite = favourite
    next()
  }


module.exports = router;