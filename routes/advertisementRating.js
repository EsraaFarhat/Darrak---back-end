const auth = require("../middleware/auth");

const { Advertisement } = require("../models/advertisement");
const { AdvertisementRating } = require("../models/advertisementRating");

const mongoose = require("mongoose");
const express = require("express");

const router = express.Router();

router.get("/:id", auth, async (req, res, next) => {
  let id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).send({ message: "Invalid Id." });
  }

  const AdvertisementRatings = await AdvertisementRating.find({AdvertisementId: id}).populate("userId");

  if (!AdvertisementRatings)
    return res
      .status(400)
      .send({ message: "This Advertisement has no ratings yet." });

  res.send({ AdvertisementRatings });
});

router.post("/", auth, async (req, res, next) => {
  const advertisement = await Advertisement.findById(req.body.AdvertisementId);
  if (!advertisement)
    return res.status(404).send({ message: "Advertisement is not found." });

  advertisementRating = new AdvertisementRating({
    AdvertisementId: req.body.AdvertisementId,
    userId: req.user._id,
    rating: req.body.rating,
    review: req.body.review,
  });

  await advertisementRating.save();
  res.send({ advertisementRating });
});

router.delete("/:id", auth, async (req, res, next) => {
    
    let id = req.params.id;
    const advertisement = await Advertisement.findById(id);
  if (!advertisement)
    return res.status(404).send({ message: "Advertisement is not found." });

  if (!mongoose.isValidObjectId(id)) {
    res.status(400).send({ message: "Invalid Id." });
  }

  const advertisementRating = await AdvertisementRating.findOneAndRemove({
    AdvertisementId: id,
    userId: req.user._id,
  });

  if (!advertisementRating)
    return res
      .status(404)
      .send({ message: "You didn't rate this Advertisement before." });

  res.send({ advertisementRating });
});

module.exports = router;
