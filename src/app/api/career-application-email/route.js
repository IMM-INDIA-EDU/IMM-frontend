import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function resolveBoolean(value, fallback = false) {
  if (typeof value === "string") {
    const lowered = value.trim().toLowerCase();
    if (lowered === "true") return true;
    if (lowered === "false") return false;
  }
  return fallback;
}

export async function POST(request) {
  try {
    const form = await request.formData();
    const name = form.get("name");
    const email = form.get("email");
    const phone = form.get("phone");
    const message = form.get("message") || "";
    const jobId = form.get("job_id") || "";
    const jobTitle = form.get("job_title") || "";
    const jobSlug = form.get("job_slug") || "";
    const resume = form.get("resume"); // File or null

    if (!name || !email || !phone || !jobId) {
      return NextResponse.json(
        { message: "Missing required fields: name, email, phone, job_id" },
        { status: 400 }
      );
    }

    const port = Number(process.env.SMTP_PORT) || 587;
    const secure =
      resolveBoolean(process.env.SMTP_SECURE, false) || Number(port) === 465;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const fromEmail =
      process.env.SMTP_FROM_CAREER ||
      process.env.SMTP_FROM ||
      process.env.SMTP_USER;
    const toEmail = process.env.SMTP_TO || fromEmail;

    const subject = `New Job Application - ${
      jobTitle || jobSlug || jobId
    } - ${name}`;
    const timeIso = new Date().toISOString();
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #a3004c; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Job Application Received</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f8fafc;">
          <h2 style="color: #a3004c; margin-top: 0;">Application Details</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px; font-weight: bold; width: 30%;">Job Position:</td>
              <td style="padding: 10px;">${jobTitle || jobSlug || jobId}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px; font-weight: bold;">Job ID:</td>
              <td style="padding: 10px;">${jobId}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px; font-weight: bold;">Name:</td>
              <td style="padding: 10px;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px; font-weight: bold;">Email:</td>
              <td style="padding: 10px;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Phone:</td>
              <td style="padding: 10px;">${phone}</td>
            </tr>
          </table>

          ${message ? `
          <div style="background-color: #fce7f3; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #a3004c; margin-top: 0;">💬 Cover Letter/Message</h3>
            <p style="margin: 5px 0; line-height: 1.6;">${String(message).replace(/\n/g, "<br/>")}</p>
          </div>
          ` : ''}

          <div style="background-color: #fce7f3; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #a3004c; margin-top: 0;">📎 Resume Attachment</h3>
            <p style="margin: 5px 0;">A resume file has been uploaded with this application.</p>
            <p style="margin: 5px 0; font-size: 14px; color: #64748b;">Please check the email attachments for the resume file.</p>
          </div>
        </div>

        <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
          <p style="margin: 0;">Submitted at: ${timeIso}</p>
          <p style="margin: 5px 0 0 0;">IMM Business School - Career Opportunities</p>
        </div>
      </div>
    `;
    const text = `Job Application Submission\n\nJob: ${
      jobTitle || jobSlug || jobId
    } (ID: ${jobId})\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}\n\nSubmitted at: ${timeIso}`;

    /** @type {import('nodemailer').SendMailOptions} */
    const mailOptions = {
      from: fromEmail,
      to: toEmail,
      subject,
      text,
      html,
      replyTo: email,
      attachments: [],
    };

    if (resume && typeof resume === "object" && "arrayBuffer" in resume) {
      const bytes = await resume.arrayBuffer();
      const buffer = Buffer.from(bytes);
      // optional: enforce 5MB max
      if (buffer.length > 5 * 1024 * 1024) {
        return NextResponse.json(
          { message: "Attachment too large (max 5MB)" },
          { status: 400 }
        );
      }
      mailOptions.attachments.push({
        filename: resume.name || "resume",
        content: buffer,
        contentType: resume.type || "application/octet-stream",
      });
    }

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Application email sent" });
  } catch (error) {
    console.error("/api/career-application-email POST error:", error);
    return NextResponse.json(
      { message: "Failed to send application email" },
      { status: 500 }
    );
  }
}
