const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const { Laundry, validate, editValidate } = require("../models/laundry");

const _ = require("lodash");
const express = require("express");

const router = express.Router();

router.get("/", auth, async (req, res, next) => {
  const laundries = await Laundry.find();
  res.send({ laundries });
});

router.post("/", [auth, isAdmin], async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  laundry = new Laundry(
    _.pick(req.body, ["image", "name", "phoneNumber", "address"])
  );

  await laundry.save();
  res.send({ laundry });
});

router.patch("/:id", [auth, isAdmin], async (req, res, next) => {
  const { error } = editValidate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  let id = req.params.id;

  laundry = await Laundry.findByIdAndUpdate(
    id,
    _.pick(req.body, ["image", "name", "phoneNumber", "address"]),
    {
      new: true,
      useFindAndModify: false,
    }
  );

  if (!laundry) return res.status(404).send({ message: "Laundry not found." });

  res.send({ laundry });
});

router.delete("/:id", [auth, isAdmin], async (req, res, next) => {
  let id = req.params.id;

  const laundry = await Laundry.findByIdAndRemove(id, {
    useFindAndModify: false,
  });

  if (!laundry) return res.status(404).send({ message: "Laundry not found." });

  res.send({ laundry });
});

router.get("/:id", auth, async (req, res, next) => {
  let id = req.params.id;
  const laundry = await Laundry.findById(id);

  if (!laundry) return res.status(400).send({ message: "Laundry not found." });

  res.send({ laundry });
});

module.exports = router;
