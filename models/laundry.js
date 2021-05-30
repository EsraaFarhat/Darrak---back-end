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


module.exports.Laundry = Laundry;
