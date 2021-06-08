const { Laundry, validate, editValidate } = require("../models/laundry");

const _ = require("lodash");
const express = require("express");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const laundries = await Laundry.find();
  res.send(laundries);
});

router.post("/", async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  laundry = new Laundry(_.pick(req.body, ["name", "phoneNumber", "address"]));

  await laundry.save();
  res.send(laundry);
});

router.patch("/:id", async (req, res, next) => {
  const { error } = editValidate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  let id = req.params.id;

  laundry = await Laundry.findByIdAndUpdate(
    id,
    _.pick(req.body, ["name", "phoneNumber", "address"]),
    {
      new: true,
      useFindAndModify: false,
    }
  );

  if (!laundry) return res.status(404).send({ message: "Laundry not found" });

  res.send(laundry);
});

module.exports = router;
