import nodemailer from "nodemailer"

const user = process.env.EMAIL_USER!;
const pass = process.env.EMAIL_PASS!;
const from = process.env.EMAIL_FROM || process.env.EMAIL_USER!;

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user,
    pass,
  },
});

export async function sendApprovalEmail(to: string, companyName: string) {
  await transporter.sendMail({
    from,
    to,
    subject: "Congratulations ! Your Company Successfully has been approved ",
    html: `
      <h2>Great news!</h2>
      <p>Your company <strong>${companyName}</strong> has been approved.</p>
      <p>You can now login and start using the platform.</p>
      <br/>
      <p>- Employee SaaS Platform</p>
    `,
  });
}
