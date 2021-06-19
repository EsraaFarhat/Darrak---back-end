module.exports = function (req, res, next) {
  if (req.user.status != "verified")
    return res.status(403).send({ message: "Verify your account first." });

  next();
};
