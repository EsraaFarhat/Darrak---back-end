const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const hasPrivilege = require("../middleware/hasPrivilege");
const { User, validate, editValidate } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const authController = require("../controllers/authController");
const Email = require("../util/email");

const router = express.Router();

//forget password
router.post("/forgetPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.get("/", [auth, isAdmin], async (req, res, next) => {
  const users = await User.find();
  res.send({ users });
});

router.post("/", async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res
      .status(400)
      .send({ message: "Email has already been token. try another one." });

  user = await User.findOne({ email: req.body.nationalId });
  if (user)
    return res.status(400).send({
      message: "National id has already been token. try another one.",
    });

  user = new User(
    _.pick(req.body, [
      "fname",
      "lname",
      "email",
      "password",
      "gender",
      "nationalId",
      "phoneNumber",
      "rating",
      "role",
    ])
  );

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const token = user.generateAuthToken();

  await user.save();

  //send welcome mail
  const url = `${req.protocol}://${req.get("host")}/api/users/me`;
  // http://127.0.0.1:3000/me
  // http://127.0.0.1:3000/api/users/me
  console.log("url = ", url);
  await new Email(user, url).sendWelcome();

  res.header("x-auth-token", token).send({
    user: _.pick(user, [
      "_id",
      "fname",
      "lname",
      "email",
      "nationalId",
      "phoneNumber",
      "rating",
      "role",
    ]),
  });
});

router.patch("/:id", auth, async (req, res, next) => {
  let id = req.params.id;

  const has_privilege = await hasPrivilege(req, id);
  if (!has_privilege)
    return res.send({
      message: "You don't have the privilege to perform this action.",
    });

  const { error } = editValidate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  if (req.body.email) {
    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(400)
        .send({ message: "Email is already in use. try another one." });
  }

  if (req.body.nationalId) {
    let user = await User.findOne({ nationalId: req.body.nationalId });
    if (user)
      return res
        .status(400)
        .send({ message: "National id is already in use. try another one." });
  }

  user = await User.findByIdAndUpdate(
    id,
    _.pick(req.body, [
      "fname",
      "lname",
      "email",
      "password",
      "gender",
      "nationalId",
      "phoneNumber",
      "rating",
    ]),
    {
      new: true,
      useFindAndModify: false,
    }
  );

  if (!user) return res.status(404).send({ message: "User not found" });

  res.send({
    user: _.pick(user, [
      "_id",
      "fname",
      "lname",
      "email",
      "nationalId",
      "phoneNumber",
      "rating",
      "role",
    ]),
  });
});

router.delete("/:id", auth, async (req, res, next) => {
  let id = req.params.id;

  const user = await User.findByIdAndRemove(id, {
    useFindAndModify: false,
  });

  if (!user) return res.status(404).send({ message: "User not found" });

  const has_privilege = await hasPrivilege(req, id);
  if (!has_privilege)
    return res.send({
      message: "You don't have the privilege to perform this action.",
    });

  res.send({
    user: _.pick(user, [
      "_id",
      "fname",
      "lname",
      "email",
      "nationalId",
      "phoneNumber",
      "rating",
      "role",
    ]),
  });
});

// For profile page
router.get("/me", auth, async (req, res, next) => {
  let id = req.user._id;
  const user = await User.findById(id);
  res.send({ user });
});

router.get("/:id", auth, async (req, res, next) => {
  let id = req.params.id;
  const user = await User.findById(id);

  if (!user) return res.status(400).send({ message: "User not found!" });

  res.send({
    user: _.pick(user, [
      "_id",
      "fname",
      "lname",
      "email",
      "nationalId",
      "phoneNumber",
      "rating",
      "role",
    ]),
  });
});

module.exports = router;
