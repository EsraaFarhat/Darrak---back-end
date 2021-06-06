const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  fname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  lname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  nationalId: {
    type: String,
    required: true,
    unique: true
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  phoneNumber: Number,
  rating: Number,
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: "user",
  }
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    fname: Joi.string().min(3).max(50).required(),
    lname: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    nationalId: Joi.string().required(),
    gender: Joi.string().allow(''),
    phoneNumber: Joi.number(),
    rating: Joi.number(),
    role: Joi.string(),
  });
  return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;
