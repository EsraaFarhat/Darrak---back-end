const mongoose = require("mongoose");

const laundrySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
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
    phoneNumber: Joi.number(),
    address: Joi.string().required(),
  });
  return schema.validate(laundry);
}


module.exports.Laundry = Laundry;
module.exports.validate = validateRestaurant;

