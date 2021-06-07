const { Advertisement } = require('../models/advertisement');
const express = require('express');


const mongoose = require('mongoose');
const router = express.Router();

router.get('/', async (req,res)=>{
    const advertisement = await Advertisement.find();
    if(!advertisement){
        res.status(500).json({
            success: false
        })
    }
    res.send(advertisement);
})

router.post('/',async (req,res)=>{

    const advertisement =  new Advertisement({
        images: req.body.images,
        address: req.body.address,
        price: req.body.price,
        internet: req.body.internet,
        owner: req.body.owner,
        publishedAt: Date.now(),
        apartmentArea: req.body.apartmentArea,
        noOfRooms: req.body.noOfRooms,
        description: req.body.description,
    })
    const createdadvertisement = await advertisement.save();
    if (createdadvertisement) {
        return res
            .status(201)
            .send({ message: 'new advertisement created', data: createdadvertisement });
    }
    return res.status(500).send({ message: ' Error in Creating Advertisement.' });
})

module.exports = router;