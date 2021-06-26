const auth = require("../middleware/auth");

const { CraftMan } = require("../models/craftman");
const { CraftManRating } = require("../models/craftManRating");

const mongoose = require("mongoose");
const express = require("express");

const router = express.Router();

router.get("/:id", auth, async (req, res, next) => {
  let id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).send({ message: "Invaild Id." });
  }

  const craftManRatings = await CraftManRating.findById(id).populate("userId");

  if (!craftManRatings)
    return res
      .status(400)
      .send({ message: "This craftMan has no ratings yet." });

  res.send({ craftManRatings });
});

router.post("/", auth, async (req, res, next) => {
  const craftMan = await CraftMan.findById(req.body.craftManId);
  if (!craftMan)
    return res.status(404).send({ message: "Craft Man is not found." });

  craftManRating = new CraftManRating({
    craftManId: req.body.craftManId,
    userId: req.user._id,
    rating: req.body.rating,
    review: req.body.review,
  });

  await craftManRating.save();
  res.send({ craftManRating });
});

router.delete("/:id", auth, async (req, res, next) => {
    
    let id = req.params.id;
    const craftMan = await CraftMan.findById(id);
  if (!craftMan)
    return res.status(404).send({ message: "Craft Man is not found." });

  if (!mongoose.isValidObjectId(id)) {
    res.status(400).send({ message: "Invaild Id." });
  }

  const craftManRating = await CraftManRating.findOneAndRemove({
    craftManId: id,
    userId: req.user._id,
  });

  if (!craftManRating)
    return res
      .status(404)
      .send({ message: "You didn't rate this craftMan before." });

  res.send({ craftManRating });
});

module.exports = router;
