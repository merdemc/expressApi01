const express = require('express');
const { IsAuthenticated } = require('../controllers/authController');
const { UpdatePassword, UpdateMe, DeleteMe, GetAllUser } = require('../controllers/userController');

const UserRouter = express.Router();


UserRouter.route("/updatepassword").patch(IsAuthenticated,UpdatePassword);
UserRouter.route("/updateme").patch(IsAuthenticated,UpdateMe);
UserRouter.route("/deleteme").delete(IsAuthenticated,DeleteMe);
UserRouter.route("/getalluser").get(GetAllUser);


module.exports = {UserRouter}