const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { Advertisement } = require('./advertisement');
const { Favourite } = require("./favourite");
const { CraftManRating } = require("./craftManRating");
const { AdvertisementRating } = require("./advertisementRating");


const userSchema = mongoose.Schema({
  image: {
    type: String,
    default:
      "https://www.bootdey.com/img/Content/avatar/avatar7.png",
  },
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
    required: [true, "Please provide a password"],
    minlength: 5,
    maxlength: 1024,
  },
  nationalId: {
    type: String,
    required: true,
    unique: true,
    minlength: 14,
    maxlength: 14,
    trim: true,
  },
  nationalIdCard: {
    type: String,
    default: ""
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
    trim: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  status: {
    type: String,
    enum: ["not verified", "pending", "verified"],
    default: "not verified",
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  passwordResetExpires: Date,
  passwordResetToken: String,
});

userSchema.pre("save", async function (next) {
  /*
  
  */
  // Only run this function if password was actually modified
  if (!this.isModified("password") || this.isNew) return next();

  // Hash the password with cost of 12
  console.log("in userSchema.pre(save, async function (next) ");
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // Delete passwordConfirm field
  // this.passwordConfirm = undefined;
  next();
});

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
      status: this.status,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};


userSchema.pre('remove', async function(next){
  await Advertisement.deleteMany({owner: this._id}).exec();
  await Favourite.deleteMany({userFrom: this._id}).exec();
  await CraftManRating.deleteMany({userId: this._id}).exec();
  await AdvertisementRating.deleteMany({userId: this._id}).exec();
  next();
});

function validateUser(user) {
  const schema = Joi.object({
    image: Joi.string(),
    fname: Joi.string().min(3).max(50).required(),
    lname: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    nationalId: Joi.string().required().min(14).length(14).trim(),
    gender: Joi.string().allow(""),
    phoneNumber: Joi.string().length(11).trim(),
    rating: Joi.number().min(0).max(5),
    role: Joi.string(),
    status: Joi.string(),
  });
  return schema.validate(user);
}

function validateEditUser(user) {
  const schema = Joi.object({
    image: Joi.string(),
    fname: Joi.string().min(3).max(50),
    lname: Joi.string().min(3).max(50),
    email: Joi.string().min(5).max(255).email(),
    password: Joi.string().min(5).max(255),
    nationalId: Joi.string().min(14).length(14).trim(),
    gender: Joi.string().allow(""),
    phoneNumber: Joi.string().length(11).trim(),
    status: Joi.string(),
  });
  return schema.validate(user);
}

const User = mongoose.model("User", userSchema);
module.exports.User = User;
module.exports.validate = validateUser;
module.exports.editValidate = validateEditUser;
