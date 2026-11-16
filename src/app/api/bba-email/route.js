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
    const { fullname, contact, email, address, course = "BBA", completed12th, hasFile = false } = body || {};

    // Validate required fields
    if (!fullname || !contact || !email || !address || !completed12th) {
      return NextResponse.json(
        { 
          success: false,
          message: "Missing required fields: fullname, contact, email, address, completed12th" 
        },
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
      process.env.SMTP_FROM_BBA ||
      process.env.SMTP_FROM ||
      process.env.SMTP_USER;
    const toEmail = process.env.SMTP_TO || fromEmail;

    const subject = `New BBA Application - ${fullname}`;
    const timeIso = new Date().toISOString();
    
    // Create HTML email content
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #a3004c; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">BBA Application Received</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f8fafc;">
          <h2 style="color: #a3004c; margin-top: 0;">Application Details</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px; font-weight: bold; width: 30%;">Full Name:</td>
              <td style="padding: 10px;">${fullname}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px; font-weight: bold;">Contact Number:</td>
              <td style="padding: 10px;">${contact}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px; font-weight: bold;">Email:</td>
              <td style="padding: 10px;">${email}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px; font-weight: bold;">City:</td>
              <td style="padding: 10px;">${address}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px; font-weight: bold;">Course:</td>
              <td style="padding: 10px;">${course}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px; font-weight: bold;">12th Completion:</td>
              <td style="padding: 10px;">${completed12th === 'yes' ? 'Yes (Eligible)' : 'No (Not Eligible)'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Marksheet Uploaded:</td>
              <td style="padding: 10px;">${hasFile ? 'Yes' : 'No'}</td>
            </tr>
          </table>

          ${hasFile ? `
          <div style="background-color: #fce7f3; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #a3004c; margin-top: 0;">📎 File Attachment</h3>
            <p style="margin: 5px 0;">A marksheet file has been uploaded with this application.</p>
            <p style="margin: 5px 0; font-size: 14px; color: #64748b;">File details will be available in the admin panel.</p>
          </div>
          ` : ''}

          <div style="background-color: #fef3c7; padding: 15px; border-radius: 5px; border-left: 4px solid #f59e0b;">
            <h3 style="color: #92400e; margin-top: 0;">⚠️ Next Steps</h3>
            <p style="margin: 5px 0; color: #92400e;">
              ${completed12th === 'yes' 
                ? 'This applicant is eligible for BBA admission. Please review their application and marksheet (if uploaded).'
                : 'This applicant is not eligible for BBA admission as they do not meet the minimum 50% score requirement in 10th and 12th.'
              }
            </p>
          </div>
        </div>

        <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
          <p style="margin: 0;">Submitted at: ${timeIso}</p>
          <p style="margin: 5px 0 0 0;">IMM Business School - BBA Admissions 2025-2028</p>
        </div>
      </div>
    `;

    // Create text version
    const text = `
BBA Application Received

Application Details:
===================
Full Name: ${fullname}
Contact Number: ${contact}
Email: ${email}
City: ${address}
Course: ${course}
12th Completion: ${completed12th === 'yes' ? 'Yes (Eligible)' : 'No (Not Eligible)'}
Marksheet Uploaded: ${hasFile ? 'Yes' : 'No'}

${hasFile ? 'A marksheet file has been uploaded with this application.' : ''}

Next Steps:
===========
${completed12th === 'yes' 
  ? 'This applicant is eligible for BBA admission. Please review their application and marksheet (if uploaded).'
  : 'This applicant is not eligible for BBA admission as they do not meet the minimum 50% score requirement in 10th and 12th.'
}

Submitted at: ${timeIso}
IMM Business School - BBA Admissions 2025-2028
    `;

    await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      subject,
      text,
      html,
      replyTo: email,
    });

    return NextResponse.json({ 
      success: true,
      message: "BBA application email sent successfully" 
    });
  } catch (error) {
    console.error("/api/bba-email POST error:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to send BBA application email" 
      },
      { status: 500 }
    );
  }
}
