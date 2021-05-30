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


module.exports.Restaurant = Restaurant;
