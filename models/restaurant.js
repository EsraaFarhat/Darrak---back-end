const mongoose = require("mongoose");

const restaurantSchema = mongoose.Schema({
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
  menu: [String],
});


const Restaurant = mongoose.model("Restaurant", restaurantSchema);

function validateRestaurant(restaurant) {
  const schema = Joi.object({
    name: Joi.string().required(),
    phoneNumber: Joi.number(),
    address: Joi.string().required(),
    menu: Joi.string(),
  });
  return schema.validate(restaurant);
}


module.exports.Restaurant = Restaurant;
module.exports.validate = validateRestaurant;