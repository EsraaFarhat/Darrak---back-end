require("./user");
require("./craftman");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const craftManRatingSchema = mongoose.Schema({
  craftManId: {
    type: Schema.Types.ObjectId,
    ref: 'CraftMan'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  rating: {
      type: Number,
      min: 0,
      max: 5,
      required: true
  },
  review: {
    type: String,
  }
});


const CraftManRating = mongoose.model("CraftManRating", craftManRatingSchema);


module.exports.CraftManRating = CraftManRating;

