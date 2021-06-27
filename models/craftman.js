const mongoose = require("mongoose");

const craftManSchema = mongoose.Schema({
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
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  phoneNumber: {
    type: String,
    required: true,
    minlength: 11,
    maxlength: 11,
  },
  profession: {
    type: String,
    required: true,
  },
  location:{
    type: String,
    enum: ["Talkha", "El-mashaya","Hy-ElGamaa", "Mit-Khamees"],
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
});

const CraftMan = mongoose.model("CraftMan", craftManSchema);

function validateCraftMan(craftMan) {
  const schema = Joi.object({
    fname: Joi.string().min(3).max(50).required(),
    lname: Joi.string().min(3).max(50).required(),
    gender: Joi.string().allow(""),
    phoneNumber: Joi.number(),
    profession: Joi.string().required(),
    rating: Joi.number(),
  });
  return schema.validate(craftMan);
}

module.exports.CraftMan = CraftMan;
module.exports.validate = validateCraftMan;
