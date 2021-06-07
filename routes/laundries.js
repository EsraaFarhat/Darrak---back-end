const { Laundry, validate } = require("../models/laundry");
const express = require("express");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const laundries = await Laundry.find();
  res.send(laundries);
});

router.post('/',async (req,res)=>{

    const laundry =  new Laundry({
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
    })
    const createdLaundry = await laundry.save();
    if (createdLaundry) {
        return res
            .status(201)
            .send({ message: 'new laundry created', data: createdLaundry });
    }
    return res.status(500).send({ message: ' Error in Creating Laundry.' });
})

module.exports = router;
