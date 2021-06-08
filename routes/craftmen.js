const auth = require("../middleware/auth");
const { CraftMan, validate } = require("../models/craftman");
const CraftManController = require("../controllers/CraftManController");
// const _ = require("lodash");
// const bcrypt = require("bcrypt");
const express = require("express");

const router = express.Router();

router
  .route("/")
  .get(CraftManController.getAllCraftMen)
  .post(CraftManController.createCraftMan);

router
  .route("/:id")
  .get(CraftManController.getCraftMan)
  .patch(CraftManController.updateCraftMan)
  .delete(CraftManController.deleteCraftMan);

// router.get("/me", auth, async (req, res, next) => {
//   let id = req.user._id;
//   const user = await User.findById(id);
//   res.send(user);
// });

// router.post("/", async (req, res, next) => {
//   // const { error } = validate(req.body);
//   // if (error) return res.status(400).send(error.details[0].message);

//   let user = await User.findOne({ email: req.body.email });
//   if (user) return res.status(400).send("User already registered!");

//   user = new User(
//     _.pick(req.body, [
//       "fname",
//       "lname",
//       "email",
//       "password",
//       "gender",
//       "nationalId",
//       "phoneNumber",
//       "rating",
//       "role",
//     ])
//   );

//   const salt = await bcrypt.genSalt(10);
//   user.password = await bcrypt.hash(user.password, salt);

//   const token = user.generateAuthToken();

//   await user.save();
//   res
//     .header("x-auth-token", token)
//     .send(
//       _.pick(user, [
//         "_id",
//         "fname",
//         "lname",
//         "email",
//         "nationalId",
//         "phoneNumber",
//         "rating",
//         "role",
//       ])
//     );
// });

// router.patch("/:id", auth, async (req, res, next) => {
//   // const { error } = patchValidate(req.body);
//   // if (error) return res.status(400).send(error.details[0].message);

//   let id = req.params.id;

//   user = await User.findByIdAndUpdate(id, req.body, {
//     new: true,
//     useFindAndModify: false,
//   });

//   if (!user) return res.status(404).send("User not found");

//   res.send(user);
// });

// router.delete("/:id", auth, async (req, res, next) => {
//   let id = req.params.id;

//   const user = await User.findByIdAndRemove(id, {
//     useFindAndModify: false,
//   });

//   if (!user) return res.status(404).send("User not found");

//   res.send(user);
// });

// router.get("/:id", auth, async (req, res, next) => {
//   let id = req.params.id;
//   const user = await User.findById(id);

//   if (!user) return res.status(400).send("User not found!");

//   res.send(user);
// });

module.exports = router;
