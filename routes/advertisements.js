const auth = require("../middleware/auth");
const hasPrivilege = require("../middleware/hasPrivilege");
const isVerified = require("../middleware/isVerified");

const { Advertisement } = require("../models/advertisement");
const { User } = require("../models/user");
const _ = require("lodash");

const express = require("express");

const mongoose = require("mongoose");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const advertisement = await Advertisement.find()
    .populate("owner")
    .sort({ publishedAt: -1 });
  if (!advertisement) {
    res.status(500).json({
      success: false,
      message: "empty advertisement",
    });
  }
  res.send({ advertisement });
});

router.get("/:id", auth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send({ message: "Invaild ID" });
  }

  const advertisement = await Advertisement.findById(req.params.id).populate(
    "owner"
  );
  if (!advertisement) {
    res.status(500).json({
      success: false,
      message: "the advertisement with given ID was not found",
    });
  }
  res.status(200).send({ advertisement });
});

router.post("/", [auth, isVerified], async (req, res) => {
  console.log(req.user);
  const advertisement = new Advertisement({
    images: req.body.images,
    address: req.body.address,
    price: req.body.price,
    internet: req.body.internet,
    owner: req.user._id,
    publishedAt: Date.now(),
    apartmentArea: req.body.apartmentArea,
    noOfRooms: req.body.noOfRooms,
    description: req.body.description,
  });
  const createdadvertisement = await advertisement.save();
  if (createdadvertisement) {
    return res
      .status(201)
      .send({
        message: "new advertisement created",
        data: createdadvertisement,
      });
  }
  return res.status(500).send({ message: " Error in Creating Advertisement." });
});

router.patch("/:id", [auth, hasPrivilege], async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send({ message: "Invaild ID" });
  }

  const advertisement = await Advertisement.findByIdAndUpdate(
    req.params.id,
    _.pick(req.body, [
      "images",
      "address",
      "price",
      "internet",
      "apartmentArea",
      "noOfRooms",
      "description",
    ]),
    { new: true }
  );
  if (!advertisement) {
    return res
      .status(404)
      .send({ message: "the advertisement cannot be updated!" });
  }
  res.send({ advertisement });
});

router.delete("/:id", [auth, hasPrivilege], async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send({ message: "Invaild ID" });
  }

  const advertisement = await Advertisement.findByIdAndRemove(req.params.id);
  if (!advertisement) {
    res.status(500).json({
      success: false,
      message: "the advertisement with given ID was not found",
    });
  } else {
    return res.status(200).json({
      success: true,
      message: "advertisement is deleted",
    });
  }
});

router.get("/get/useradvertisement", auth, async (req, res) => {
  console.log(req.user);
  const userAdvertidementList = await Advertisement.find({
    owner: req.user._id,
  }).sort({ publishedAt: -1 });

  if (!userAdvertidementList) {
    res.status(500).json({ success: false });
  }
  res.send(userAdvertidementList);
});

module.exports = router;
