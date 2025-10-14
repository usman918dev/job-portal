import express from 'express';
import { sendApplicationNotificationToAdmin } from '../services/emailService.js';

const router = express.Router();

// Test email route
router.post('/test-email', async (req, res) => {
  try {
    console.log('🔍 Testing email service...');
    console.log('Email config:', {
      user: process.env.EMAIL_USER,
      hasPassword: !!process.env.EMAIL_PASS,
      frontend: process.env.FRONTEND_URL
    });

    const result = await sendApplicationNotificationToAdmin(
      process.env.ADMIN_EMAIL || 'zainkhokhar@gmail.com',
      {
        jobTitle: 'Test Job Title',
        companyName: 'Test Company',
        salaryRange: '$50,000 - $70,000'
      },
      {
        applicantName: 'Test Applicant',
        applicantEmail: 'test@example.com',
        resumeUrl: 'https://drive.google.com/test'
      }
    );

    console.log('Email result:', result);
    res.json({ success: true, message: 'Test email sent', result });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ success: false, error: error.message, stack: error.stack });
  }
});

export default router;