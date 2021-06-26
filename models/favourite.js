const mongoose = require("mongoose");
require("./user");
require("./advertisement");
const Schema = mongoose.Schema;

const favouriteSchema = mongoose.Schema({
  advertismentFrom: {
    type: Schema.Types.ObjectId,
    ref: 'Advertisement'
  },
  userFrom: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});


const Favourite = mongoose.model("Favourite", favouriteSchema);


module.exports.Favourite = Favourite;

