const nodemailer = require("nodemailer");

//

const SendEmail = async (option) => {
  // Create a transporter
  // Transporter is responsible for sending email
  // Here, we are not going to use Gamil
  // Like Gmail there other well-known services like send grid, mail gun etc.
  // We are going to use send grid
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, //"Gamil"
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Define email OPTIONS
  const emailOptions = {
    from: "Movie support<support@movies.com>",
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

 await transporter.sendMail(emailOptions);
};

module.exports = { SendEmail };
