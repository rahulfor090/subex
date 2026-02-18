const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: process.env.EMAIL_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    /**
     * Send welcome email to new user
     */
    async sendWelcomeEmail(user) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM || '"Subex" <noreply@subex.com>',
                to: user.email,
                subject: 'Welcome to Subex',
                html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .content {
                background: #f9fafb;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .greeting {
                font-size: 18px;
                margin-bottom: 20px;
              }
              .message {
                margin-bottom: 20px;
              }
              .features {
                background: white;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
              }
              .features ul {
                list-style: none;
                padding: 0;
              }
              .features li {
                padding: 8px 0;
                padding-left: 25px;
                position: relative;
              }
              .features li:before {
                content: "•";
                color: #10b981;
                font-weight: bold;
                font-size: 20px;
                position: absolute;
                left: 0;
              }
              .footer {
                margin-top: 30px;
                font-size: 14px;
                color: #666;
              }
              .signature {
                margin-top: 20px;
                font-style: italic;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="margin: 0;">Welcome to Subex</h1>
            </div>
            <div class="content">
              <div class="greeting">
                Dear ${user.first_name},
              </div>
              
              <div class="message">
                <p>Welcome to Subex.</p>
                <p>We're delighted to have you on board.</p>
                <p>Your account has been successfully created, and you're now ready to start managing your subscriptions with clarity and control. Subex is designed to help you track renewals, monitor spending, and stay informed — all in one secure and streamlined platform.</p>
              </div>

              <div class="features">
                <strong>Here's what you can do next:</strong>
                <ul>
                  <li>Add your active subscriptions</li>
                  <li>Set renewal reminders</li>
                  <li>Monitor upcoming billing dates</li>
                  <li>Stay organized with complete visibility</li>
                </ul>
              </div>

              <div class="message">
                <p>If you have any questions or need assistance, our support team is always here to help.</p>
                <p>Thank you for choosing Subex. We look forward to helping you stay ahead of every subscription.</p>
              </div>

              <div class="signature">
                Warm regards,<br>
                The Subex Team
              </div>
            </div>
          </body>
          </html>
        `,
                text: `
Dear ${user.first_name},

Welcome to Subex.

We're delighted to have you on board.

Your account has been successfully created, and you're now ready to start managing your subscriptions with clarity and control. Subex is designed to help you track renewals, monitor spending, and stay informed — all in one secure and streamlined platform.

Here's what you can do next:
• Add your active subscriptions
• Set renewal reminders
• Monitor upcoming billing dates
• Stay organized with complete visibility

If you have any questions or need assistance, our support team is always here to help.

Thank you for choosing Subex. We look forward to helping you stay ahead of every subscription.

Warm regards,
The Subex Team
        `,
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Welcome email sent successfully:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Error sending welcome email:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Send password reset email
     */
    async sendPasswordResetEmail(user, resetToken) {
        try {
            const baseUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
            const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

            const mailOptions = {
                from: process.env.EMAIL_FROM || '"Subex" <noreply@subex.com>',
                to: user.email,
                subject: 'Password Reset Request - Subex',
                html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .content {
                background: #f9fafb;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .button {
                display: inline-block;
                padding: 12px 30px;
                background: #10b981;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                margin: 20px 0;
                font-weight: bold;
              }
              .warning {
                background: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
              }
              .footer {
                margin-top: 20px;
                font-size: 14px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="margin: 0;">Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello ${user.first_name},</p>
              
              <p>We received a request to reset your password for your Subex account. Click the button below to reset your password:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #10b981;">${resetUrl}</p>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong><br>
                This link will expire in 1 hour for security reasons. If you didn't request a password reset, please ignore this email or contact support if you have concerns.
              </div>
              
              <div class="footer">
                <p>Best regards,<br>The Subex Team</p>
              </div>
            </div>
          </body>
          </html>
        `,
                text: `
Hello ${user.first_name},

We received a request to reset your password for your Subex account.

Click the link below to reset your password:
${resetUrl}

This link will expire in 1 hour for security reasons.

If you didn't request a password reset, please ignore this email or contact support if you have concerns.

Best regards,
The Subex Team
        `,
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Password reset email sent successfully:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Error sending password reset email:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Verify email configuration
     */
    async verifyConnection() {
        try {
            await this.transporter.verify();
            console.log('Email service is ready to send emails');
            return true;
        } catch (error) {
            console.error('Email service configuration error:', error);
            return false;
        }
    }
}

module.exports = new EmailService();
