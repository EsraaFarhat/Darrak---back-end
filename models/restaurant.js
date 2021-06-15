const mongoose = require("mongoose");

const restaurantSchema = mongoose.Schema({
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
  menu: [{
    type: String,
    required: true
  }],
  image: {
    type: String,
    required: true,
  }
});


const Restaurant = mongoose.model("Restaurant", restaurantSchema);

function validateRestaurant(restaurant) {
  const schema = Joi.object({
    name: Joi.string().required(),
    phoneNumber: Joi.number(),
    address: Joi.string().required(),
    menu: Joi.array(),
  });
  return schema.validate(restaurant);
}


module.exports.Restaurant = Restaurant;
module.exports.validate = validateRestaurant;