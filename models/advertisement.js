const mongoose = require("mongoose");
require("./user");

const advertisementSchema = mongoose.Schema({
  images: [{
    type: String,
    required: true,
  }],
  address: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  internet: {
    type: Boolean,
    default: false,
  },
  owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
  },
  publishedAt:{ 
    type: Date,
    default: Date.now(),
  },
  apartmentArea: {
    type: Number,
    required: true
  },
  noOfRooms:{
    type: Number,
    required: true
  },
  description: {
    type: String,
  },
});


const Advertisement = mongoose.model("Advertisement", advertisementSchema);

function validateAdvertisement(advertisement) {
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
  return schema.validate(advertisement);
}

module.exports.Advertisement = Advertisement;
module.exports.validate = validateAdvertisement;

