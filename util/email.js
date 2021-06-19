const nodemailer = require("nodemailer");
// const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.fname;
    this.url = url;
    this.from = `Darrak <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    // Sendgrid

    return nodemailer.createTransport({
      service: "SendGrid",
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    // const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
    //   firstName: this.firstName,
    //   url: this.url,
    //   subject,
    // });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      //   html,
      //   text: htmlToText.fromString(html),
      text: this.url,
    };
    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to the Darrak !");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Please click the link provided, to reset your password"
    );
  }
};
