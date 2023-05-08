const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL, // Change env for Sender's email
    pass: process.env.GMAIL_KEY, // Change env for gmail generated key
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = transporter;
