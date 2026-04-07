import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    this.verifyConnection();
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log("✅ Email service ready");
    } catch (error: any) {
      console.error("❌ Email connection failed:", error.message);
    }
  }

  // =============================================
  // 📩 GENERIC SEND EMAIL
  // =============================================
  async sendEmail(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: `"Kaaya Prime App" <${process.env.EMAIL}>`,
        to,
        subject,
        html,
      });

      console.log(`📧 Email sent to ${to}`);
      return true;
    } catch (error: any) {
      console.error("❌ Email send error:", error.message);
      return false;
    }
  }


  // =============================================
  // 💬 5. NEW MESSAGE NOTIFICATION
  // =============================================
  async sendNewMessage(email: string, name: string, senderName: string) {
    return this.sendEmail(
      email,
      "💬 New Message Received",
      `
      <h2>Hello ${name},</h2>
      <p>You received a new message from <b>${senderName}</b>.</p>
      <p>Login to your account to reply.</p>
      <br/>
      <p>Thanks,<br/>Kaaya Prime Team</p>
      `
    );
  }
  // =============================================
  // 🔐 SEND OTP EMAIL
  // =============================================
  async sendOtpEmail(email: string, otp: string, name = "User") {
    try {
      console.log(`📧 Sending OTP to: ${email}`);

      const html = `
      <h2>Hello ${name},</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for 5 minutes.</p>
      <br/>
      <p>Thanks,<br/>Kaaya Prime Team</p>
    `;

      await this.transporter.sendMail({
        from: `"Kaaya Prime App" <${process.env.EMAIL}>`,
        to: email,
        subject: "🔐 OTP Verification",
        html,
      });

      console.log(`✅ OTP sent to ${email}`);

      return true;

    } catch (error: any) {
      console.error("❌ OTP email failed:", error.message);

      // fallback
      console.log(`🔐 OTP for ${email}: ${otp}`);

      return true;
    }
  }

  async sendPasswordResetEmail(email: string, name: string) {
    return this.sendEmail(
      email,
      "🔑 Password Reset Successful",
      `
      <h2>Hello ${name},</h2>
      <p>Your password has been successfully reset.</p>
      <p>If this wasn't you, contact support immediately.</p>
      <br/>
      <p>Thanks,<br/>Kaaya Prime Team</p>
      `
    );
  }

  async sendLeadCreatedEmail(
    email: string,
    name: string,
    leadName: string,
    createdBy: string
  ) {
    return this.sendEmail(
      email,
      "🎯 New Lead Created",
      `
    <h2>Hello ${name},</h2>
    
    <p>A new lead has been successfully created in your account.</p>
    
    <p><b>Lead Name:</b> ${leadName}</p>
    <p><b>Created By:</b> ${createdBy}</p>
    
    <p>You can now review and manage this lead by logging into your dashboard.</p>
    
    <br/>
    
    <p>Best regards,<br/>Kaaya Prime Team</p>
    `
    );
  }
}

export const emailService = new EmailService();