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
    unique: true,
    minlength: 14,
    maxlength: 14,
    trim: true
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  phoneNumber: {
    type: String,
    required: true,
    minlength: 11,
    maxlength: 11,
    trim: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  favourites : [{
    type: Array,
    default: []
  }],
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role
    },
    process.env.jwtPrivateKey
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
    nationalId: Joi.string().required().min(14).length(14).trim(),
    gender: Joi.string().allow(''),
    phoneNumber: Joi.string().length(11).trim(),
    rating: Joi.number().min(0).max(5),
    role: Joi.string(),
  });
  return schema.validate(user);
}

function validateEditUser(user) {
  const schema = Joi.object({
    fname: Joi.string().min(3).max(50),
    lname: Joi.string().min(3).max(50),
    email: Joi.string().min(5).max(255).email(),
    password: Joi.string().min(5).max(255),
    nationalId: Joi.string().min(14).length(14).trim(),
    gender: Joi.string().allow(''),
    phoneNumber: Joi.string().length(11).trim(),
  });
  return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;
module.exports.editValidate = validateEditUser;
