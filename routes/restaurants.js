const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const {Restaurant} = require('../models/restaurant');

const express = require('express');

const router = express.Router();

router.get('/',auth, async(req, res) => {
    const restaurants = await Restaurant.find();
    res.send({restaurants});
});

router.get('/:id',auth, getRestaurant,(req, res) => {
    res.json({restaurant: res.restaurant});
});

router.post('/',[auth, isAdmin], async(req, res) => {
    const restaurant = new Restaurant({
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        menu: req.body.menu,
        image: req.body.image
    });
    const newRestaurant = await restaurant.save();
    res.status(201).json({newRestaurant});
});

router.patch('/:id',[auth, isAdmin], getRestaurant,async(req, res) => {
    if(req.body.name != null){
        res.restaurant.name = req.body.name;
    }

    if(req.body.phoneNumber != null){
        res.restaurant.phoneNumber = req.body.phoneNumber;
    }

    if(req.body.address != null){
        res.restaurant.address = req.body.address;
    }

    if(req.body.menu != null){
        res.restaurant.menu = req.body.menu;
    }
    if(req.body.image != null){
        res.restaurant.image = req.body.image;
    }

    const updatedRestaurant = await res.restaurant.save();
    res.json({updatedRestaurant});
});

router.delete('/:id',[auth, isAdmin], getRestaurant, async(req, res) => {
        await res.restaurant.remove();
        res.json({message: 'Restaurant deleted'});
});


async function getRestaurant(req, res, next) {
    let restaurant
    try {
        restaurant = await Restaurant.findById(req.params.id)
      if (restaurant == null) {
        return res.status(404).json({ message: 'Cannot find restaurant' })
      }
    } catch (err) {
      return res.status(500).json({ message: err.message })
    }
  
    res.restaurant = restaurant
    next()
  }

module.exports = router;