const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const { CraftManRating } = require("../models/craftManRating");

const _ = require("lodash");
const express = require("express");

const router = express.Router();

router.get("/:id", auth, async (req, res, next) => {
  let id = req.params.id;
  const craftManRatings = await CraftManRating.findById(id).populate("userId");

  if (!craftManRatings)
    return res
      .status(400)
      .send({ message: "This craftMan has no ratings yet." });

  res.send({ craftManRatings });
});

router.post("/", auth, async (req, res, next) => {
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
