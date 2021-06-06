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
  internet: {
    type: Boolean,
    default: false,
  },
  owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
  },
  publishedAt: Date,
  apartmentArea: Number
});


const Advertisement = mongoose.model("Advertisement", advertisementSchema);

function validateAdvertisement(advertisement) {
  const schema = Joi.object({
    image: Joi.string().required(),
    address: Joi.string().required(),
    price: Joi.number().required(),
    internet: Joi.Boolean(),
    apartmentArea: Joi.number(),
    publishedAt: Joi.Date()
  });
  return schema.validate(advertisement);
}

module.exports.Advertisement = Advertisement;
module.exports.validate = validateAdvertisement;

