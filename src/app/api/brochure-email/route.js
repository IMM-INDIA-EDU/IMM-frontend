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
    const { name, mobile, email, state } = body || {};

    if (!name || !mobile || !email || !state) {
      return NextResponse.json(
        { message: "Missing required fields: name, mobile, email, state" },
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
      process.env.SMTP_FROM_BROCHURE ||
      process.env.SMTP_FROM ||
      process.env.SMTP_USER;
    const toEmail = process.env.SMTP_TO || fromEmail;

    const subject = `New Brochure Request - ${name}`;
    const timeIso = new Date().toISOString();
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #a3004c; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Brochure Download Request</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f8fafc;">
          <h2 style="color: #a3004c; margin-top: 0;">Request Details</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px; font-weight: bold; width: 30%;">Name:</td>
              <td style="padding: 10px;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px; font-weight: bold;">Mobile:</td>
              <td style="padding: 10px;">${mobile}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px; font-weight: bold;">Email:</td>
              <td style="padding: 10px;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">State:</td>
              <td style="padding: 10px;">${state}</td>
            </tr>
          </table>

          <div style="background-color: #fce7f3; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #a3004c; margin-top: 0;">📄 Brochure Request</h3>
            <p style="margin: 5px 0;">This person has requested to download the IMM Business School brochure.</p>
            <p style="margin: 5px 0; font-size: 14px; color: #64748b;">Please follow up with them regarding their interest in our programs.</p>
          </div>
        </div>

        <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
          <p style="margin: 0;">Submitted at: ${timeIso}</p>
          <p style="margin: 5px 0 0 0;">IMM Business School - Brochure Request</p>
        </div>
      </div>
    `;
    const text = `Brochure Download Request\n\nName: ${name}\nMobile: ${mobile}\nEmail: ${email}\nState: ${state}\n\nSubmitted at: ${timeIso}`;

    await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      subject,
      text,
      html,
      replyTo: email,
    });

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("/api/brochure-email POST error:", error);
    return NextResponse.json(
      { message: "Failed to send email" },
      { status: 500 }
    );
  }
}
