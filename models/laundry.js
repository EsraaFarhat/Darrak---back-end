const mongoose = require("mongoose");
const Joi = require('joi');

const laundrySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    minlength: 11,
    maxlength: 11,
  },
  address: {
    type: String,
    required: true,
  },
});


const Laundry = mongoose.model("Laundry", laundrySchema);

function validateLaundry(laundry) {
  const schema = Joi.object({
    name: Joi.string().required(),
    phoneNumber: Joi.string().length(11).required(),
    address: Joi.string().required(),
  });
  return schema.validate(laundry);
}

function validateEditLaundry(laundry) {
  const schema = Joi.object({
    name: Joi.string(),
    phoneNumber: Joi.string().length(11),
    address: Joi.string(),
  });
  return schema.validate(laundry);
}

module.exports.Laundry = Laundry;
module.exports.validate = validateLaundry;
module.exports.editValidate = validateEditLaundry;

