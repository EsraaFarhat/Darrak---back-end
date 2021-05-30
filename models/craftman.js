const mongoose = require("mongoose");

const craftManSchema = mongoose.Schema({
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
  phoneNumber: Number,
  profession: {
    type: String,
    required: true,
  },
  rating: Number,
});


const CraftMan = mongoose.model("CraftMan", craftManSchema);


module.exports.CraftMan = CraftMan;
