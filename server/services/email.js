// server/services/email.js
import nodemailer from 'nodemailer';

const email = import.meta.env.VITE_EMAIL || 'test@test.com';
const password = import.meta.env.VITE_EMAIL_PASSWORD || '1234';

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail as the email service
  auth: {
    user: email, // Your email address
    pass: password, // Your password or app password
  },
});

/**
 * Sends an email.
 *
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The email subject.
 * @param {string} body - The email body.
 * @returns {Promise<void>}
 */
async function sendEmail(to, subject, body) {
  try {
    // Define the email options
    const mailOptions = {
      from: email, // Sender address
      to: to, // Recipient address
      subject: subject, // Subject line
      text: body, // Plain text body
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

export { sendEmail };