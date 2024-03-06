const { AsyncErrorHandler } = require("../helpers/asyncErrorHandler");
const { CreateSendResponse } = require("../helpers/createResponse");
const { CustomError } = require("../helpers/customError");
const { User } = require("../modals/userModel");

const filterReqObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((prob) => {
    if (allowedFields.includes(prob)) {
      newObj[prob] = obj[prob];
    }
  });
  return newObj;
};

const UpdatePassword = AsyncErrorHandler(async (req, res, next) => {
  // Get current user data from database
  const user = await User.findById({ _id: req.user._id }).select("+password");

  // Check if the provided password correct or not
  if (!(await user.comparePassword(req.body.currentPassword, user.password))) {
    return next(new CustomError("provided password is not matched", 401));
  }
  // Change the password if provided password is correct
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  // Login the user & send JWT
  CreateSendResponse(user, 200, res);
});

const GetAllUser = AsyncErrorHandler(async (req, res, next) => {
  //const allUser = await User.find({ active: true });
  // We are using pre quesry middleware in User Model.
  const allUser = await User.find();
  CreateSendResponse(allUser, 200, res);
});

const UpdateMe = AsyncErrorHandler(async (req, res, next) => {
  // Check password and if it is provided than reject the request
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new CustomError(
        "You cannot update your password using this endpoint",
        400
      )
    );
  }

  // Update user details
  // we cannot use "user.save()" method here. Since save method expect passowrd and confirmpassword. But we are not providing password and confrimpassword
  const filterObj = filterReqObj(req.body, "name", "email");
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filterObj, {
    runValidators: true,
    new: true,
  });
  CreateSendResponse(updatedUser, 200, res);
});

const DeleteMe = AsyncErrorHandler(async (req, res, next) => {
  const deletedUser = await User.findByIdAndUpdate(req.user._id, {
    active: false,
  });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

module.exports = {
  GetAllUser,
  UpdatePassword,
  UpdateMe,
  DeleteMe,
};
