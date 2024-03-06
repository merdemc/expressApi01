const { AsyncErrorHandler } = require("../helpers/asyncErrorHandler");
const { CustomError } = require("../helpers/customError");
const { GetToken } = require("../helpers/jwtToken");
const { User } = require("../modals/userModel");
const jwt = require("jsonwebtoken");
const util = require("node:util");
const { SendEmail } = require("../helpers/mail");
const { CurrencyCodes } = require("validator/lib/isISO4217");
const crypto = require("node:crypto");
const { CreateSendResponse } = require("../helpers/createResponse");

const SignUpHandler = AsyncErrorHandler(async (req, res, next) => {
  const newUser = await User.create(req.body);

  CreateSendResponse(newUser, 201, res);
});

const LoginHandler = AsyncErrorHandler(async (req, res, next) => {
  // const email = req.body.email;
  // const password = req.body.password;
  const { email, password } = req.body;
  // Check if email and password provided or not
  if (!password || !email) {
    const error = new CustomError(
      "Please provide email & password for login!",
      400
    );
    return next(error);
  }

  // Check user exist in database or not
  const user = await User.findOne({ email: email }).select("+password");

  // Compare password
  //const isMatch = await user.comparePassword(password, user.password);

  if (!user || !(await user.comparePassword(password, user.password))) {
    const error = new CustomError(
      "Incorrect email email & password for login!",
      400
    );
    return next(error);
  }

  // Send token for logged i users
  CreateSendResponse(user, 200, res);

  const token = GetToken(user._id);

  //next();
});

// Check authenticaiton - middleware
const IsAuthenticated = AsyncErrorHandler(async (req, res, next) => {
  // 1. Read token if it is exist or not
  const receivedToken = req.headers.authorization;
  let token;
  if (receivedToken && receivedToken.startsWith("bearer")) {
    token = receivedToken.split(" ")[1];
  }
  console.log("token:", token);
  if (!token) {
    next(new CustomError("You are not logged in !", 404));
  }

  // 2. Validate token
  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT
  );
  console.log("decodedToken:", decodedToken);
  // 3. Check the user, exist or not
  const user = await User.findById(decodedToken.id);
  if (!user) {
    const error = new CustomError("The user is not exist", 401);
    next(error);
  }

  // 4. If the user changed password after the token was issued
  const isPasswordChanged = await user.IsPasswordChanged(decodedToken.iat);
  if (isPasswordChanged) {
    const error = new CustomError(
      "The password has been changed recently. Please login again.",
      401
    );
    next(error);
  }

  // 5. Allow user to access route
  req.user = user; // Attach user to the request onject. later on this user information will be utilized.
  next();
});

const CheckRole = (role) => {
  return (req, res, next) => {
    // Check role. We added user object during IsAuthenticated middleware.
    if (req.user.role !== role) {
      const error = new CustomError(
        "You have no right to perform this action",
        403
      );
      next(error);
    }
    next();
  };
};

// If multoplem role passed to CheckRole function. Following code can be used
// (... role) it makes an arry [role1, role2, etc]
const CheckMultipleRole = (...role) => {
  return (req, res, next) => {
    // Check role. We added user object during IsAuthenticated middleware.
    if (!role.includes(req.user.role)) {
      const error = new CustomError(
        "You have no right to perform this action",
        403
      );
      next(error);
    }
    next();
  };
};

// user will make post request
// we will get user based on email
// we will generate a token (not necessary jwt)
// We will send the token to the provided email.
// user will make again post request with ResetPassword along with new password and received token
const ForgotPassword = AsyncErrorHandler(async (req, res, next) => {
  // get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    const error = new CustomError("Please provide valid email", 404);
    next(error);
  }

  // generate random reset token
  const resetToken = user.createResetPasswordToken();
  //await user.save();
  await user.save({ validateBeforeSave: false });

  // send an email with reset token
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetpassword/${resetToken}`;
  const message = `We have received a password reset request. Please use the below link to reset your password\n\n${resetUrl}\n\nThis reset password link will be valid only for 10 minutes.`;

  try {
    // I added "const email = " in order to get the log

    const email = await SendEmail({
      email: user.email,
      subject: "password change request",
      message: message,
    });
    console.log("sendEmail", email);

    res.status(200).json({
      status: "success",
      message: "Password reset link send to the user email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExprires = undefined;
    user.save({ validateBeforeSave: false });

    const error = new CustomError(
      "There is an error while sending password reset email. Please try again later.",
      500
    );

    return next(error);
  }
});
const ResetPassword = AsyncErrorHandler(async (req, res, next) => {
  // Check the user
  const token = crypto
    .creatHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetTokenExprires: { $gt: Date.now() },
  });
  // Handle not found user
  if (!user) {
    const error = new CustomError("Token is invalid or expired!", 400);
    next(error);
  }
  // Handle found user. Resetting password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExprires = undefined;
  user.passwordChangedAt = Date.now();

  // Save new password with validation
  user.save();
  // Login the user
  CreateSendResponse(user, 200, res);
});

module.exports = {
  SignUpHandler,
  LoginHandler,
  IsAuthenticated,
  CheckRole,
  ForgotPassword,
  ResetPassword,
};
