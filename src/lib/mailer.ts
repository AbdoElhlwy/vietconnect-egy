import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "localhost",
  port: Number(process.env.SMTP_PORT) || 1025,
  secure: false,
  auth: process.env.SMTP_USER
    ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
    : undefined,
  ignoreTLS: true
});

export async function sendMail(to: string, subject: string, html: string) {
  if (!process.env.SMTP_HOST) {
    // Development fallback: log instead of failing when no SMTP is configured.
    console.log(`[MAIL:PREVIEW] to=${to} subject="${subject}"\n${html}`);
    return { previewed: true };
  }
  return transporter.sendMail({
    from: process.env.EMAIL_FROM || "VietConnect Egy <no-reply@vietconnect-egy.local>",
    to,
    subject,
    html
  });
}

export const emailTemplates = {
  welcome: (name: string) => `<h2>Welcome, ${name}!</h2><p>Your VietConnect Egy account has been created.</p>`,
  verifyEmail: (link: string) => `<h2>Verify your email</h2><p><a href="${link}">Click here to verify</a></p>`,
  resetPassword: (link: string) => `<h2>Reset your password</h2><p><a href="${link}">Click here to reset</a></p>`,
  appointmentConfirmed: (service: string, date: string) => `<h2>Appointment Confirmed</h2><p>${service} on ${date}</p>`,
  appointmentReminder: (service: string, date: string) => `<h2>Reminder</h2><p>Your appointment for ${service} is on ${date}</p>`,
  requestUpdated: (ref: string, status: string) => `<h2>Request Updated</h2><p>Request ${ref} is now ${status}</p>`,
  documentsNeeded: (ref: string) => `<h2>Documents Needed</h2><p>Please upload additional documents for request ${ref}</p>`,
  requestResolved: (ref: string) => `<h2>Request Resolved</h2><p>Your request ${ref} has been resolved</p>`,
  documentExpiring: (docName: string, date: string) => `<h2>Document Expiring Soon</h2><p>${docName} expires on ${date}</p>`,
  emergencyAlert: (ref: string) => `<h2>Emergency Case Received</h2><p>Reference: ${ref}. Our team will contact you shortly.</p>`
};
