const { GetToken } = require("./jwtToken");

const CreateSendResponse = (user, statusCode, res) => {
  const token = GetToken(user._id);

  // We are sending token to the client in the cookie with http only.
  // Hackers can take and use token if it is stored in the web browser local storage.

  const options = {
    maxAge: process.env.LOGIN_EXPIRES,
    // secure: true, // cookie sends only https connection
    httpOnly: true, // cookie cannot be accessed from web browser
  };

  if (process.env.NODE_ENV) {
    options.secure = true;
  }

  res.cookie("jwt", token, options);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token: token,
    data: {
      user: user,
    },
  });
};

module.exports = { CreateSendResponse };
