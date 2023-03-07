import { createTransport, Transporter } from "nodemailer";
import * as SMTPTransport from "nodemailer/lib/smtp-transport";

class Email {
  private transporter!: Transporter;
  static instance: Email;
  static getInstance() {
    typeof Email.instance === "undefined" && (Email.instance = new Email());
    return Email.instance;
  }
  private createTransporter(): Transporter {
    if (typeof this.transporter === "undefined") {
      let options: SMTPTransport.Options;
      switch (process.env.SMTP_SERVICE) {
        case "gmail":
          options = {
            service: "gmail",
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASSWORD,
            },
          };
          break;
        default:
          options = {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === "yes",
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASSWORD,
            },
          };
          break;
      }
      this.transporter = createTransport(options);
    }
    return this.transporter;
  }
  async send(subject: string, html: string, text: string = "") {
    await this.createTransporter().sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject,
      text,
      html,
    });
  }
}

export default Email;
