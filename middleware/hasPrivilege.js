const { User } = require("../models/user");
const { Advertisement } = require("../models/advertisement");

module.exports = async function (req, id) {
  const user = await User.findById(id);
  const advertisement = await Advertisement.findById(id);
  console.log("id = ", id);
  // console.log(user);
  if (user) {
    if (user._id.equals(req.user._id)) return true;
  }
  if (advertisement) {
    if (advertisement.owner.equals(req.user._id)) return true;
  }
  if (req.user.role == "admin") return true;

  return false;
};
