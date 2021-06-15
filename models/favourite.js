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

function validateFavourite(favourite) {
  const schema = Joi.object({
    images: Joi.array().required(),
    address: Joi.string().required(),
    price: Joi.number().required(),
    internet: Joi.Boolean(),
    apartmentArea: Joi.number().required(),
    noOfRooms: Joi.number().required(),
    description: Joi.string(),
    publishedAt: Joi.Date(),
  });
  return schema.validate(favourite);
}

module.exports.Favourite = Favourite;
module.exports.validate = validateFavourite;

