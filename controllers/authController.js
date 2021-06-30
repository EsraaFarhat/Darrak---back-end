const { User } = require("../models/user");
const Email = require("../util/email");
const crypto = require("crypto");
const _ = require("lodash");

exports.forgotPassword = async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({
      status: "failed",
      message: "There is no user with this email address",
    });
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try {
    // const resetURL = `${req.protocol}://${req.get(
    //   "host"
    // )}/api/users/resetPassword/${resetToken}`;
    const resetURL = `https://darrak.netlify.app/resetPassword/${resetToken}`;
    // const resetURL = `http://localhost:3001/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      status: "failed",
      message: "There was an error sending the email. Try again later!",
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return res.status(400).json({
      status: "failed",
      message: "Token is invalid or has expired",
    });
  }
  user.password = req.body.password;
  //   user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send({
    user: _.pick(user, [
      "_id",
      "fname",
      "lname",
      "email",
      "nationalId",
      "phoneNumber",
      "rating",
      "role",
    ]),
  });
};
