const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const { User, validate, editValidate } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");

const router = express.Router();

router.get("/",[auth, isAdmin], async (req, res, next) => {
  const users = await User.find();
  res.send(users);
});

router.get("/me", auth, async (req, res, next) => {
  let id = req.user._id;
  const user = await User.findById(id)
  res.send(user);
});


router.post("/", async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({message: error.details[0].message});
  
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send({message: "Email has already been token. try another one."});

  user = await User.findOne({ email: req.body.nationalId });
  if (user) return res.status(400).send({message: "National id has already been token. try another one."});

  user = new User(
    _.pick(req.body, ["fname", "lname", "email", "password", "gender", "nationalId", "phoneNumber", "rating", "role"])
  );

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const token = user.generateAuthToken();

  await user.save();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "fname", "lname", "email", "nationalId", "phoneNumber", "rating", "role"]));
});

router.patch("/:id", auth, async (req, res, next) => {
  const { error } = editValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let id = req.params.id;

  if(req.body.email){
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send({message: "Email is already in use. try another one."});
  }

  if(req.body.nationalId){
    let user = await User.findOne({ nationalId: req.body.nationalId });
    if (user) return res.status(400).send({message: "National id is already in use. try another one."});
  }


  user = await User.findByIdAndUpdate(id, _.pick(req.body, ["fname", "lname", "email", "password", "gender", "nationalId", "phoneNumber", "rating"]), {
    new: true,
    useFindAndModify: false,
  });

  if (!user) return res.status(404).send({message: "User not found"});

  res.send(_.pick(user, ["_id", "fname", "lname", "email", "nationalId", "phoneNumber", "rating", "role"]));

});

router.delete("/:id", auth, async (req, res, next) => {
  let id = req.params.id;

  const user = await User.findByIdAndRemove(id, {
    useFindAndModify: false,
  });

  if (!user) return res.status(404).send({message: "User not found"});

  res.send(_.pick(user, ["_id", "fname", "lname", "email", "nationalId", "phoneNumber", "rating", "role"]));
});

router.get("/:id", auth, async (req, res, next) => {
  let id = req.params.id;
  const user = await User.findById(id);

  if (!user) return res.status(400).send({message: "User not found!"});

  res.send(_.pick(user, ["_id", "fname", "lname", "email", "nationalId", "phoneNumber", "rating", "role"]));
});

module.exports = router;
