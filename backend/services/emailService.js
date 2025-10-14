import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { EMAIL_TEMPLATES } from '../constants/emailTemplates.js';

dotenv.config();

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send email verification
export const sendVerificationEmail = async (email, verificationToken, userName) => {
  try {
    const transporter = createTransporter();

    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@jobly.com',
      to: email,
      subject: 'Verify Your Email - Jobly Job Portal',
      html: EMAIL_TEMPLATES.VERIFICATION_EMAIL(userName, verificationUrl)
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully to:', email);
    return { success: true, message: 'Verification email sent successfully' };

  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, message: 'Failed to send verification email', error: error.message };
  }
};

// Send welcome email after verification
export const sendWelcomeEmail = async (email, userName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@jobly.com',
      to: email,
      subject: 'Welcome to Jobly - Your Account is Verified!',
      html: EMAIL_TEMPLATES.WELCOME_EMAIL(userName, process.env.FRONTEND_URL || 'http://localhost:5173')
    };

    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully to:', email);
    return { success: true, message: 'Welcome email sent successfully' };

  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, message: 'Failed to send welcome email', error: error.message };
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken, userName) => {
  try {
    const transporter = createTransporter();

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@jobly.com',
      to: email,
      subject: 'Reset Your Password - Jobly',
      html: EMAIL_TEMPLATES.PASSWORD_RESET_EMAIL(userName, resetUrl)
    };

    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully to:', email);
    return { success: true, message: 'Password reset email sent successfully' };

  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, message: 'Failed to send password reset email', error: error.message };
  }
};

// Send password reset confirmation email
export const sendPasswordResetConfirmationEmail = async (email, userName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@jobly.com',
      to: email,
      subject: 'Password Reset Successful - Jobly',
      html: EMAIL_TEMPLATES.PASSWORD_RESET_CONFIRMATION_EMAIL(userName, process.env.FRONTEND_URL || 'http://localhost:5173')
    };

    await transporter.sendMail(mailOptions);
    console.log('Password reset confirmation email sent successfully to:', email);
    return { success: true, message: 'Password reset confirmation email sent successfully' };

  } catch (error) {
    console.error('Error sending password reset confirmation email:', error);
    return { success: false, message: 'Failed to send password reset confirmation email', error: error.message };
  }
};

// Send job application notification to admin
export const sendApplicationNotificationToAdmin = async (adminEmail, jobDetails, applicantDetails) => {
  try {
    const transporter = createTransporter();

    const { jobTitle, companyName, salaryRange } = jobDetails;
    const { applicantEmail, applicantName, resumeUrl } = applicantDetails;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@jobly.com',
      to: adminEmail,
      subject: `New Application Received - ${jobTitle}`,
      html: EMAIL_TEMPLATES.APPLICATION_NOTIFICATION_TO_ADMIN(jobTitle, companyName, salaryRange, applicantName, applicantEmail, resumeUrl, process.env.FRONTEND_URL || 'http://localhost:5173')
    };

    await transporter.sendMail(mailOptions);
    console.log('Application notification email sent successfully to admin:', adminEmail);
    return { success: true, message: 'Application notification email sent successfully' };

  } catch (error) {
    console.error('Error sending application notification email:', error);
    return { success: false, message: 'Failed to send application notification email', error: error.message };
  }
};

// Send application accepted email to applicant
export const sendApplicationAcceptedEmail = async (applicantEmail, applicantName, jobDetails) => {
  try {
    const transporter = createTransporter();

    const { jobTitle, companyName, salaryRange } = jobDetails;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@jobly.com',
      to: applicantEmail,
      subject: `🎉 Congratulations! Your Application was Accepted - ${jobTitle}`,
      html: EMAIL_TEMPLATES.APPLICATION_ACCEPTED_EMAIL(applicantName, jobTitle, companyName, salaryRange, process.env.FRONTEND_URL || 'http://localhost:5173')
    };

    await transporter.sendMail(mailOptions);
    console.log('Application accepted email sent successfully to:', applicantEmail);
    return { success: true, message: 'Application accepted email sent successfully' };

  } catch (error) {
    console.error('Error sending application accepted email:', error);
    return { success: false, message: 'Failed to send application accepted email', error: error.message };
  }
};

// Send application rejected email to applicant
export const sendApplicationRejectedEmail = async (applicantEmail, applicantName, jobDetails) => {
  try {
    const transporter = createTransporter();

    const { jobTitle, companyName } = jobDetails;

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@jobly.com',
      to: applicantEmail,
      subject: `Application Update - ${jobTitle}`,
      html: EMAIL_TEMPLATES.APPLICATION_REJECTED_EMAIL(applicantName, jobTitle, companyName, process.env.FRONTEND_URL || 'http://localhost:5173')
    };

    await transporter.sendMail(mailOptions);
    console.log('Application rejected email sent successfully to:', applicantEmail);
    return { success: true, message: 'Application rejected email sent successfully' };

  } catch (error) {
    console.error('Error sending application rejected email:', error);
    return { success: false, message: 'Failed to send application rejected email', error: error.message };
  }
};
