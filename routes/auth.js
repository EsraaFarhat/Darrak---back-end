const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const express = require("express");

const router = express.Router();

router.post("/", async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send({ message: "Invalid email or password!" });
  console.log("email ok");
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  console.log("validPassword = ", validPassword);
  console.log("req.body.password= ", req.body.password);
  console.log("user.password= ", user.password);

  if (!validPassword)
    return res.status(400).send({ message: "Invalid email or password!" });

  const token = user.generateAuthToken();

  res.json({
    api_token: token,
    fname: user.fname,
    lname: user.lname,
  });
});

// router.get('/logout', async(req, res, next) => {
//   res.removeHeader('x-auth-token');
//   res.status(200).send({message: 'Bye Bye!'});
// });

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(req);
}

module.exports = router;
