const express = require('express');
const { SignUpHandler, LoginHandler, ForgotPassword,ResetPassword,IsAuthenticated } = require('../controllers/authController');

const AuthRouter = express.Router();

AuthRouter.route("/signup").post(SignUpHandler);
AuthRouter.route("/login").post(LoginHandler);
AuthRouter.route("/forgotpassword").post(ForgotPassword);
AuthRouter.route("/resetpassword/:token").patch(ResetPassword);



module.exports = {AuthRouter}