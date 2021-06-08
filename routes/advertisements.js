const { Advertisement } = require('../models/advertisement');
const { User } = require('../models/user')
const express = require('express');


const mongoose = require('mongoose');
const router = express.Router();

router.get('/', async (req,res)=>{
    const advertisement = await Advertisement.find().populate('owner');
    if(!advertisement){
        res.status(500).json({
            success: false
        })
    }
    res.send(advertisement);
})

router.get('/:id', async (req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invaild ID')
    }
    
    const advertisement = await Advertisement.findById(req.params.id).populate('owner');
    if(!advertisement){
        res.status(500).json({
            success: false,
            message: 'the advertisement with given ID was not found'
        })
    }
    res.status(200).send(advertisement);
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