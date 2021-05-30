const mongoose = require("mongoose");
require("./user");

const advertisementSchema = mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
  },
  publishedAt: Date,
  area: Number
});


const Advertisement = mongoose.model("Advertisement", advertisementSchema);


module.exports.Advertisement = Advertisement;
