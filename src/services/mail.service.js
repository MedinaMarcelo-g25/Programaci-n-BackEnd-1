const transporter = require('../config/mailer.config');
const jwt = require('jsonwebtoken');
const { resetPasswordTemplate } = require('../utils/email.templates');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

class MailService {
  static async sendPasswordReset(user) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;
    const html = resetPasswordTemplate(`${user.first_name} ${user.last_name}`, resetLink);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Restablecer contraseña - TechStore',
      html
    });
    return token;
  }
}
module.exports = MailService;