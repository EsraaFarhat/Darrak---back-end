const auth = require("../middleware/auth");
const hasPrivilege = require("../middleware/hasPrivilege");
const isVerified = require("../middleware/isVerified");
const adController = require("../controllers/adController");

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

router.post(
  "/",
  [auth, isVerified],
  adController.createAd,
  adController.getCheckoutSession
);

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
