import nodemailer from "nodemailer";
import path from "path";

const user = process.env.EMAIL_USER!;
const pass = process.env.EMAIL_PASS!;
const from = process.env.EMAIL_FROM || `SynTask <${process.env.EMAIL_USER}>`;

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user,
    pass,
  },
});

export async function sendApprovalEmail(to: string, companyName: string) {
  // Logo ka absolute path nikalne ke liye
  const logoPath = path.join(process.cwd(), "public", "syntask_logo.jpg");

  await transporter.sendMail({
    from,
    to,
    subject: `Welcome to the SynTask Network | ${companyName} Approved`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden;">
        <div style="background-color: #f8fafc; padding: 40px 20px; text-align: center; border-bottom: 1px solid #e2e8f0;">
          <img src="cid:syntasklogo" alt="SynTask Logo" style="width: 80px; height: 80px; border-radius: 16px; margin-bottom: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <h1 style="margin: 0; color: #0f172a; font-size: 28px; font-weight: 800; tracking: -0.025em;">SynTask <span style="color: #4f46e5;">Verified</span></h1>
        </div>

        <div style="padding: 40px 30px; background-color: #ffffff;">
          <h2 style="color: #0f172a; margin-top: 0;">Congratulations!</h2>
          <p style="font-size: 16px;">We are pleased to inform you that <strong>${companyName}</strong> has been successfully verified and onboarded to the SynTask ecosystem.</p>
          
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 16px; margin: 25px 0;">
            <p style="margin: 0; font-size: 14px; color: #475569; font-weight: 600;">STATUS: ACTIVE</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #64748b;">Your dedicated workspace has been provisioned and is ready for use.</p>
          </div>

          <p style="font-size: 16px;">As an administrator, you can now manage your employees, assign workflows, and monitor real-time tasks.</p>
          
          <div style="text-align: center; margin-top: 35px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" style="background-color: #4f46e5; color: #ffffff; padding: 14px 30px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block; shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);">
              Launch Your Dashboard
            </a>
          </div>
        </div>

        <div style="padding: 30px; background-color: #f8fafc; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; font-size: 12px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">
            Sent by SynTask Management Team
          </p>
          <p style="margin: 8px 0 0 0; font-size: 12px; color: #cbd5e1;">
            Secure multi-tenant infrastructure for modern enterprises.
          </p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: "syntask_logo.jpg",
        path: logoPath,
        cid: "syntasklogo", // Isse HTML mein image render hogi
      },
    ],
  });
}
export async function sendWelcomeEmail(to: string, name: string, loginEmail: string, companyName: string, companyId: string) {
  const logoPath = path.join(process.cwd(), "public", "syntask_logo.jpg");

  await transporter.sendMail({
    from,
    to, // Yeh personal/contact email hai (Destination)
    subject: `Action Required: Your SynTask Workspace is Ready`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden;">
        <div style="background-color: #f8fafc; padding: 30px; text-align: center;">
          <img src="cid:logo" style="width: 60px; border-radius: 12px;">
          <h1 style="color: #0f172a; font-size: 24px;">Welcome to SynTask</h1>
        </div>
        <div style="padding: 40px 30px;">
          <p>Hi <strong>${name}</strong>,</p>
          <p>You have been onboarded to the <strong>${companyName}</strong> workspace. Use the credentials below to access your dashboard:</p>
          
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Organization ID:</strong> <code style="color: #4f46e5;">${companyId}</code></p>
            <p style="margin: 5px 0;"><strong>Login Email:</strong> ${loginEmail}</p> <p style="margin: 5px 0;"><strong>Default Password:</strong> <code style="color: #4f46e5;">employee123</code></p>
          </div>

          <p style="font-size: 13px; color: #64748b;">*Please change your password immediately after your first login for security reasons.</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" style="background-color: #4f46e5; color: white; padding: 12px 25px; border-radius: 10px; text-decoration: none; font-weight: bold; display: inline-block;">Login to Dashboard</a>
          </div>
        </div>
      </div>
    `,
    attachments: [{ filename: "logo.jpg", path: logoPath, cid: "logo" }],
  });
}