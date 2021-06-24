const { CraftMan, validate } = require("../models/craftman");
const _ = require("lodash");

exports.getAllCraftMen = async (req, res, next) => {
  let filter = {};
    if(req.query.location)
    {
        filter = {
                    location: req.query.location,
                }
    }
  const craftmen = await CraftMan.find(filter);
  // res.send(craftmen);
  res.status(200).json({
    status: "success",
    num: craftmen.length,
    craftmen,
  });
};

exports.createCraftMan = async (req, res, next) => {
  let craftMan = await CraftMan.findOne({ phoneNumber: req.body.phoneNumber });
  if (craftMan)
    return res.status(400).send({ message: "account already exist!" });
  console.log("in create");
  craftMan = new CraftMan(
    _.pick(req.body, [
      "fname",
      "lname",
      "gender",
      "phoneNumber",
      "profession",
      "location",
    ])
  );

  await craftMan.save();
  res.status(200).json({
    status: "success",
    craftMan,
  });
};

exports.deleteCraftMan = async (req, res, next) => {
  let id = req.params.id;
  const craftman = await CraftMan.findByIdAndRemove(id);
  if (!craftman) return res.status(404).send({ message: "account not found" });
  res.status(200).json({
    status: "success",
    message: "deleted",
  });
};

exports.getCraftMan = async (req, res, next) => {
  let id = req.params.id;
  const craftman = await CraftMan.findById(id);
  if (!craftman) return res.status(404).send({ message: "account not found" });
  res.status(200).json({
    status: "success",
    craftman,
  });
};

exports.updateCraftMan = async (req, res, next) => {
  let id = req.params.id;
  let craftman = await CraftMan.findById(id);
  if (!craftman) return res.status(404).send({ message: "account not found" });

  craftman = _.pick(req.body, [
    "fname",
    "lname",
    "gender",
    "phoneNumber",
    "profession",
    "location",
  ]);
  craftman = await CraftMan.findByIdAndUpdate(id, craftman, { new: true });

  //   console.log(craftman);
  res.status(200).json({
    status: "success",
    craftman,
  });
};
