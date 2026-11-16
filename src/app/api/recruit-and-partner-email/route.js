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
    const body = await request.json().catch(() => ({}));
    const { fullName, email, title, company, connectionType, comments } =
      body || {};

    if (!fullName || !email || !connectionType) {
      return NextResponse.json(
        { message: "Missing required fields: fullName, email, connectionType" },
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
      process.env.SMTP_FROM_RECRUIT ||
      process.env.SMTP_FROM ||
      process.env.SMTP_USER;
    const toEmail = process.env.SMTP_TO || fromEmail;

    const subject = `Recruit & Partner - ${fullName} (${connectionType})`;
    const timeIso = new Date().toISOString();
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #a3004c; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Recruit & Partner Submission</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f8fafc;">
          <h2 style="color: #a3004c; margin-top: 0;">Contact Details</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px; font-weight: bold; width: 30%;">Name:</td>
              <td style="padding: 10px;">${fullName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px; font-weight: bold;">Email:</td>
              <td style="padding: 10px;">${email}</td>
            </tr>
            ${title ? `
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px; font-weight: bold;">Title:</td>
              <td style="padding: 10px;">${title}</td>
            </tr>
            ` : ''}
            ${company ? `
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px; font-weight: bold;">Company:</td>
              <td style="padding: 10px;">${company}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 10px; font-weight: bold;">Connection Type:</td>
              <td style="padding: 10px;">${connectionType}</td>
            </tr>
          </table>

          ${comments ? `
          <div style="background-color: #fce7f3; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #a3004c; margin-top: 0;">💬 Comments/Message</h3>
            <p style="margin: 5px 0; line-height: 1.6;">${String(comments).replace(/\n/g, "<br/>")}</p>
          </div>
          ` : ''}

          <div style="background-color: #fce7f3; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #a3004c; margin-top: 0;">🤝 Partnership Interest</h3>
            <p style="margin: 5px 0;">This person is interested in ${connectionType.toLowerCase()} with IMM Business School.</p>
            <p style="margin: 5px 0; font-size: 14px; color: #64748b;">Please follow up to discuss potential collaboration opportunities.</p>
          </div>
        </div>

        <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
          <p style="margin: 0;">Submitted at: ${timeIso}</p>
          <p style="margin: 5px 0 0 0;">IMM Business School - Recruit & Partner</p>
        </div>
      </div>
    `;
    const text = `Recruit & Partner Submission\n\nName: ${fullName}\nEmail: ${email}\nTitle: ${
      title || ""
    }\nCompany: ${
      company || ""
    }\nConnection Type: ${connectionType}\n\nComments:\n${
      comments || ""
    }\n\nSubmitted at: ${timeIso}`;

    await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      subject,
      text,
      html,
      replyTo: email,
    });

    return NextResponse.json({ message: "Recruit & Partner email sent" });
  } catch (error) {
    console.error("/api/recruit-and-partner-email POST error:", error);
    return NextResponse.json(
      { message: "Failed to send recruitment email" },
      { status: 500 }
    );
  }
}
