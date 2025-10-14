// Email templates constants
export const EMAIL_TEMPLATES = {
    // Email verification template
    VERIFICATION_EMAIL: (userName, verificationUrl) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Jobly!</h1>
        <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Find Your Next Journey</p>
      </div>

      <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #1a202c; margin-bottom: 20px;">Hi ${userName}!</h2>
        <p style="color: #4a5568; line-height: 1.6; margin-bottom: 25px;">
          Thank you for signing up with Jobly! To complete your registration and start exploring amazing job opportunities, please verify your email address.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}"
             style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Verify Email Address
          </a>
        </div>

        <p style="color: #718096; font-size: 14px; line-height: 1.5; margin-top: 25px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${verificationUrl}" style="color: #667eea; word-break: break-all;">${verificationUrl}</a>
        </p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;">

        <p style="color: #a0aec0; font-size: 12px; text-align: center; margin: 0;">
          This verification link will expire in 24 hours. If you didn't create an account with Jobly, please ignore this email.
        </p>
      </div>

      <div style="text-align: center; margin-top: 20px;">
        <p style="color: #a0aec0; font-size: 12px; margin: 0;">
          © 2025 Jobly. All rights reserved.
        </p>
      </div>
    </div>
  `,

    // Welcome email template
    WELCOME_EMAIL: (userName, frontendUrl) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
      <div style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Account Verified!</h1>
        <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Welcome to the Jobly Community</p>
      </div>

      <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #1a202c; margin-bottom: 20px;">Hi ${userName}!</h2>
        <p style="color: #4a5568; line-height: 1.6; margin-bottom: 25px;">
          Congratulations! Your email has been successfully verified. You can now access all features of Jobly and start your journey to find the perfect job.
        </p>

        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px;">What's next?</h3>
          <ul style="color: #4a5568; margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">Complete your profile</li>
            <li style="margin-bottom: 8px;">Upload your resume</li>
            <li style="margin-bottom: 8px;">Browse job opportunities</li>
            <li>Start applying to your dream jobs!</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${frontendUrl}/profile"
             style="display: inline-block; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Complete Your Profile
          </a>
        </div>
      </div>

      <div style="text-align: center; margin-top: 20px;">
        <p style="color: #a0aec0; font-size: 12px; margin: 0;">
          © 2025 Jobly. All rights reserved.
        </p>
      </div>
    </div>
  `,

    // Password reset email template
    PASSWORD_RESET_EMAIL: (userName, resetUrl) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
      <div style="background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🔒 Password Reset</h1>
        <p style="color: #bee3f8; margin: 10px 0 0 0; font-size: 16px;">Reset your password securely</p>
      </div>

      <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #1a202c; margin-bottom: 20px;">Hi ${userName}!</h2>
        <p style="color: #4a5568; line-height: 1.6; margin-bottom: 25px;">
          We received a request to reset your password for your Jobly account. Click the button below to create a new password.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}"
             style="display: inline-block; background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%);
                    color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px;
                    font-weight: bold; font-size: 16px; transition: all 0.3s ease;">
            Reset My Password
          </a>
        </div>

        <div style="background: #fef2e2; border-left: 4px solid #f6ad55; padding: 15px; margin: 25px 0; border-radius: 4px;">
          <p style="color: #744210; margin: 0; font-size: 14px;">
            <strong>⚠️ Important:</strong> This link will expire in 15 minutes for security reasons.
          </p>
        </div>

        <p style="color: #718096; font-size: 14px; margin-bottom: 20px;">
          If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
        </p>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
          <p style="color: #a0aec0; font-size: 12px; margin-bottom: 10px;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="color: #3182ce; font-size: 12px; word-break: break-all; margin: 0;">
            ${resetUrl}
          </p>
        </div>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #a0aec0; font-size: 12px; margin: 0;">
          © 2025 Jobly. All rights reserved.
        </p>
      </div>
    </div>
  `,

    // Password reset confirmation email template
    PASSWORD_RESET_CONFIRMATION_EMAIL: (userName, frontendUrl) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
      <div style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
        <h1 style="color: white; margin: 0; font-size: 28px;">✅ Password Reset Successful</h1>
        <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Your password has been updated</p>
      </div>

      <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #1a202c; margin-bottom: 20px;">Hi ${userName}!</h2>
        <p style="color: #4a5568; line-height: 1.6; margin-bottom: 25px;">
          Your password has been successfully reset. You can now sign in to your Jobly account using your new password.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${frontendUrl}/signin"
             style="display: inline-block; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
                    color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px;
                    font-weight: bold; font-size: 16px; transition: all 0.3s ease;">
            Sign In Now
          </a>
        </div>

        <div style="background: #fef2e2; border-left: 4px solid #f6ad55; padding: 15px; margin: 25px 0; border-radius: 4px;">
          <p style="color: #744210; margin: 0; font-size: 14px;">
            <strong>🔒 Security Note:</strong> If you didn't make this change, please contact our support team immediately.
          </p>
        </div>

        <p style="color: #718096; font-size: 14px; margin-bottom: 20px;">
          For your security, we recommend using a strong, unique password that you don't use for other accounts.
        </p>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #a0aec0; font-size: 12px; margin: 0;">
          © 2025 Jobly. All rights reserved.
        </p>
      </div>
    </div>
  `,

    // Application notification to admin template
    APPLICATION_NOTIFICATION_TO_ADMIN: (jobTitle, companyName, salaryRange, applicantName, applicantEmail, resumeUrl, frontendUrl) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
        <h1 style="color: white; margin: 0; font-size: 28px;">📋 New Job Application</h1>
        <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">A candidate has applied to your job posting</p>
      </div>

      <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #1a202c; margin-bottom: 20px;">Application Details</h2>

        <div style="background: #f7fafc; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px;">
          <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px;">Job Information</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #718096; font-weight: 600; width: 40%;">Job Title:</td>
              <td style="padding: 8px 0; color: #2d3748; font-weight: bold;">${jobTitle}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #718096; font-weight: 600;">Company:</td>
              <td style="padding: 8px 0; color: #2d3748;">${companyName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #718096; font-weight: 600;">Salary Range:</td>
              <td style="padding: 8px 0; color: #2d3748;">${salaryRange}</td>
            </tr>
          </table>
        </div>

        <div style="background: #edf2f7; border-left: 4px solid #48bb78; padding: 20px; margin: 20px 0; border-radius: 4px;">
          <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px;">Applicant Information</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #718096; font-weight: 600; width: 40%;">Name:</td>
              <td style="padding: 8px 0; color: #2d3748; font-weight: bold;">${applicantName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #718096; font-weight: 600;">Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${applicantEmail}" style="color: #667eea; text-decoration: none;">${applicantEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #718096; font-weight: 600;">Resume:</td>
              <td style="padding: 8px 0;"><a href="${resumeUrl}" target="_blank" style="color: #667eea; text-decoration: none; font-weight: 600;">📄 View Resume</a></td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${frontendUrl}/admin/applications"
             style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px;
                    font-weight: bold; font-size: 16px;">
            View in Dashboard
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;">

        <p style="color: #a0aec0; font-size: 12px; text-align: center; margin: 0;">
          You received this email because you have job application notifications enabled in your profile settings.
        </p>
      </div>

      <div style="text-align: center; margin-top: 20px;">
        <p style="color: #a0aec0; font-size: 12px; margin: 0;">
          © 2025 Jobly. All rights reserved.
        </p>
      </div>
    </div>
  `,

    // Application accepted email template
    APPLICATION_ACCEPTED_EMAIL: (applicantName, jobTitle, companyName, salaryRange, frontendUrl) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
      <div style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Application Accepted!</h1>
        <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Great news about your application</p>
      </div>

      <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #1a202c; margin-bottom: 20px;">Hi ${applicantName}!</h2>
        <p style="color: #4a5568; line-height: 1.6; margin-bottom: 25px;">
          Congratulations! We are pleased to inform you that your application for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been accepted!
        </p>

        <div style="background: #f0fdf4; border-left: 4px solid #48bb78; padding: 20px; margin: 20px 0; border-radius: 4px;">
          <h3 style="color: #166534; margin: 0 0 15px 0; font-size: 18px;">Job Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #15803d; font-weight: 600; width: 40%;">Position:</td>
              <td style="padding: 8px 0; color: #166534; font-weight: bold;">${jobTitle}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #15803d; font-weight: 600;">Company:</td>
              <td style="padding: 8px 0; color: #166534;">${companyName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #15803d; font-weight: 600;">Salary Range:</td>
              <td style="padding: 8px 0; color: #166534;">${salaryRange}</td>
            </tr>
          </table>
        </div>

        <div style="background: #fef2e2; border-left: 4px solid #f6ad55; padding: 15px; margin: 25px 0; border-radius: 4px;">
          <p style="color: #744210; margin: 0; font-size: 14px;">
            <strong>📧 Next Steps:</strong> The hiring team will contact you shortly with further instructions about the next steps in the hiring process.
          </p>
        </div>

        <p style="color: #4a5568; line-height: 1.6; margin-bottom: 25px;">
          Thank you for your interest in joining ${companyName}. We look forward to the possibility of working with you!
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${frontendUrl}/applications"
             style="display: inline-block; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
                    color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px;
                    font-weight: bold; font-size: 16px;">
            View Your Applications
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;">

        <p style="color: #a0aec0; font-size: 12px; text-align: center; margin: 0;">
          You received this email because you have application notifications enabled in your profile settings.
        </p>
      </div>

      <div style="text-align: center; margin-top: 20px;">
        <p style="color: #a0aec0; font-size: 12px; margin: 0;">
          © 2025 Jobly. All rights reserved.
        </p>
      </div>
    </div>
  `,

    // Application rejected email template
    APPLICATION_REJECTED_EMAIL: (applicantName, jobTitle, companyName, frontendUrl) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Application Update</h1>
        <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Thank you for your interest</p>
      </div>

      <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #1a202c; margin-bottom: 20px;">Hi ${applicantName},</h2>
        <p style="color: #4a5568; line-height: 1.6; margin-bottom: 25px;">
          Thank you for your interest in the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.
        </p>

        <p style="color: #4a5568; line-height: 1.6; margin-bottom: 25px;">
          After careful consideration, we regret to inform you that we have decided to move forward with other candidates whose qualifications more closely match our current needs.
        </p>

        <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 4px;">
          <p style="color: #1e40af; margin: 0; font-size: 14px; line-height: 1.6;">
            <strong>💼 Keep Going!</strong> We appreciate the time and effort you put into your application. We encourage you to apply for future opportunities that match your skills and experience. Your perfect job is out there!
          </p>
        </div>

        <p style="color: #4a5568; line-height: 1.6; margin-bottom: 25px;">
          We wish you the very best in your job search and future professional endeavors. Thank you again for considering ${companyName}.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${frontendUrl}/"
             style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px;
                    font-weight: bold; font-size: 16px;">
            Explore More Opportunities
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;">

        <p style="color: #a0aec0; font-size: 12px; text-align: center; margin: 0;">
          You received this email because you have application notifications enabled in your profile settings.
        </p>
      </div>

      <div style="text-align: center; margin-top: 20px;">
        <p style="color: #a0aec0; font-size: 12px; margin: 0;">
          © 2025 Jobly. All rights reserved.
        </p>
      </div>
    </div>
  `
};