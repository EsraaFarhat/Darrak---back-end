const { User } = require("../models/user");
const { Advertisement } = require("../models/advertisement");

module.exports = async function (req, res, next) {
  let id = req.params.id;

  const user = await User.findById(id);
  if (user) {
    if (user._id.equals(req.user._id)) return next();
  }

  const advertisement = await Advertisement.findById(id);
  if (advertisement) {
    if (advertisement.owner.equals(req.user._id)) return next();
  }

  if (req.user.role == "admin") return next();

  return res
    .status(403)
    .send({ message: "You don't have the privilege to perform this action." });
};
