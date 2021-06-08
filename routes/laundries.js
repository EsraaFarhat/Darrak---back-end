const { Laundry, validate } = require("../models/laundry");

const _ = require('lodash');
const express = require("express");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const laundries = await Laundry.find();
  res.send(laundries);
});

router.post("/", async (req, res, next) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send({message: error.details[0].message});
    
    laundry = new Laundry(
      _.pick(req.body, ["name", "phoneNumber", "address"])
    );
  
    await laundry.save();
    res.send(laundry);
  });

module.exports = router;
