require("./user");
require("./advertisement");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdvertisementRatingSchema = mongoose.Schema({
  AdvertisementId: {
    type: Schema.Types.ObjectId,
    ref: 'Advertisement'
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


const AdvertisementRating = mongoose.model("AdvertisementRating", AdvertisementRatingSchema);


module.exports.AdvertisementRating = AdvertisementRating;

