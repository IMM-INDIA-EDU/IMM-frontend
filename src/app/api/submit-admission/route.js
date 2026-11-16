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

// Helper function to format date
function formatDate(date) {
  return new Date(date).toLocaleString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

// Generate beautiful HTML email template
function generateEmailTemplate(data, applicationId, submissionDate) {
  const {
    fullName,
    gender,
    nationality,
    aadhaarNumber,
    mobileNumber,
    alternateMobileNumber,
    email,
    city,
    state,
    fathersName,
    fathersMobileNumber,
    fathersOccupation,
    annualFamilyIncome,
    tenthBoard,
    tenthPercentage,
    twelfthBoard,
    twelfthYear,
    twelfthPercentage,
    graduationDegree,
    graduationYear,
    graduationPercentage,
    entranceExamName,
    entranceExamScore,
    hasWorkExperience,
    organizationName,
    designation,
    duration,
    natureOfWork,
    specialization,
    declaration,
  } = data;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PGDM Admission Application</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6; padding: 20px;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #ffffff; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px; font-weight: bold;">New PGDM Admission Application</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.95;">2026-28 Batch</p>
            </td>
          </tr>

          <!-- Application Info -->
          <tr>
            <td style="padding: 20px; background-color: #ffffff;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; background-color: #eff6ff; border-radius: 6px; border-left: 4px solid #3b82f6;">
                    <p style="margin: 0; font-size: 14px; color: #1f2937;"><strong>Application ID:</strong> <span style="color: #3b82f6; font-weight: bold;">${applicationId}</span></p>
                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #1f2937;"><strong>Submission Date:</strong> ${submissionDate}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Section 1: Personal Details -->
          <tr>
            <td style="padding: 0 20px 20px 20px;">
              <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 15px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                <h2 style="font-size: 18px; font-weight: bold; color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin: 0 0 15px 0;">Personal Details</h2>
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #4b5563; width: 40%; border-bottom: 1px solid #f3f4f6;">Full Name:</td>
                    <td style="padding: 8px 0; color: #1f2937; width: 60%; border-bottom: 1px solid #f3f4f6;">${fullName || "Not provided"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Gender:</td>
                    <td style="padding: 8px 0; color: #1f2937; border-bottom: 1px solid #f3f4f6;">${gender || "Not provided"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Nationality:</td>
                    <td style="padding: 8px 0; color: #1f2937; border-bottom: 1px solid #f3f4f6;">${nationality || "Not provided"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #4b5563;">Aadhaar Number:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${aadhaarNumber || "Not provided"}</td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Section 2: Contact Information -->
          <tr>
            <td style="padding: 0 20px 20px 20px;">
              <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 15px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                <h2 style="font-size: 18px; font-weight: bold; color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin: 0 0 15px 0;">Contact Information</h2>
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #4b5563; width: 40%; border-bottom: 1px solid #f3f4f6;">Mobile Number:</td>
                    <td style="padding: 8px 0; color: #1f2937; width: 60%; border-bottom: 1px solid #f3f4f6;">${mobileNumber || "Not provided"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Alternate Mobile:</td>
                    <td style="padding: 8px 0; color: #1f2937; border-bottom: 1px solid #f3f4f6;">${alternateMobileNumber || "Not provided"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Email ID:</td>
                    <td style="padding: 8px 0; color: #1f2937; border-bottom: 1px solid #f3f4f6;">${email || "Not provided"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #4b5563;">City, State:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${city || "Not provided"}, ${state || "Not provided"}</td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Section 3: Parent/Guardian Details -->
          <tr>
            <td style="padding: 0 20px 20px 20px;">
              <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 15px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                <h2 style="font-size: 18px; font-weight: bold; color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin: 0 0 15px 0;">Parent/Guardian Details</h2>
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #4b5563; width: 40%; border-bottom: 1px solid #f3f4f6;">Father's Name:</td>
                    <td style="padding: 8px 0; color: #1f2937; width: 60%; border-bottom: 1px solid #f3f4f6;">${fathersName || "Not provided"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Father's Mobile:</td>
                    <td style="padding: 8px 0; color: #1f2937; border-bottom: 1px solid #f3f4f6;">${fathersMobileNumber || "Not provided"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Father's Occupation:</td>
                    <td style="padding: 8px 0; color: #1f2937; border-bottom: 1px solid #f3f4f6;">${fathersOccupation || "Not provided"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #4b5563;">Annual Family Income:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${annualFamilyIncome || "Not provided"}</td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Section 4: Academic Qualifications -->
          <tr>
            <td style="padding: 0 20px 20px 20px;">
              <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 15px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                <h2 style="font-size: 18px; font-weight: bold; color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin: 0 0 15px 0;">Academic Qualifications</h2>
                
                <h3 style="font-size: 16px; font-weight: 600; color: #1f2937; margin: 15px 0 10px 0;">10th Details</h3>
                <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #4b5563; width: 40%; border-bottom: 1px solid #f3f4f6;">Board:</td>
                    <td style="padding: 8px 0; color: #1f2937; width: 60%; border-bottom: 1px solid #f3f4f6;">${tenthBoard || "Not provided"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #4b5563;">Percentage/CGPA:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${tenthPercentage || "Not provided"}</td>
                  </tr>
                </table>

                <h3 style="font-size: 16px; font-weight: 600; color: #1f2937; margin: 15px 0 10px 0;">12th Details</h3>
                <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #4b5563; width: 40%; border-bottom: 1px solid #f3f4f6;">Board:</td>
                    <td style="padding: 8px 0; color: #1f2937; width: 60%; border-bottom: 1px solid #f3f4f6;">${twelfthBoard || "Not provided"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Year of Passing:</td>
                    <td style="padding: 8px 0; color: #1f2937; border-bottom: 1px solid #f3f4f6;">${twelfthYear || "Not provided"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #4b5563;">Percentage/CGPA:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${twelfthPercentage || "Not provided"}</td>
                  </tr>
                </table>

                <h3 style="font-size: 16px; font-weight: 600; color: #1f2937; margin: 15px 0 10px 0;">Graduation Details</h3>
                <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #4b5563; width: 40%; border-bottom: 1px solid #f3f4f6;">Degree:</td>
                    <td style="padding: 8px 0; color: #1f2937; width: 60%; border-bottom: 1px solid #f3f4f6;">${graduationDegree || "Not provided"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Year of Passing:</td>
                    <td style="padding: 8px 0; color: #1f2937; border-bottom: 1px solid #f3f4f6;">${graduationYear || "Not provided"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #4b5563;">Percentage/CGPA:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${graduationPercentage || "Not provided"}</td>
                  </tr>
                </table>

                ${entranceExamName || entranceExamScore ? `
                <h3 style="font-size: 16px; font-weight: 600; color: #1f2937; margin: 15px 0 10px 0;">Entrance Exam</h3>
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #4b5563; width: 40%; border-bottom: 1px solid #f3f4f6;">Exam Name:</td>
                    <td style="padding: 8px 0; color: #1f2937; width: 60%; border-bottom: 1px solid #f3f4f6;">${entranceExamName || "Not provided"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #4b5563;">Score/Percentile:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${entranceExamScore || "Not provided"}</td>
                  </tr>
                </table>
                ` : ''}
              </div>
            </td>
          </tr>

          <!-- Section 5: Work Experience -->
          <tr>
            <td style="padding: 0 20px 20px 20px;">
              <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 15px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                <h2 style="font-size: 18px; font-weight: bold; color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin: 0 0 15px 0;">Work Experience</h2>
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #4b5563; width: 40%; border-bottom: 1px solid #f3f4f6;">Has Work Experience:</td>
                    <td style="padding: 8px 0; color: #1f2937; width: 60%; border-bottom: 1px solid #f3f4f6;">${hasWorkExperience || "Not provided"}</td>
                  </tr>
                  ${hasWorkExperience === "Yes" ? `
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Organization:</td>
                    <td style="padding: 8px 0; color: #1f2937; border-bottom: 1px solid #f3f4f6;">${organizationName || "Not provided"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Designation:</td>
                    <td style="padding: 8px 0; color: #1f2937; border-bottom: 1px solid #f3f4f6;">${designation || "Not provided"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Duration:</td>
                    <td style="padding: 8px 0; color: #1f2937; border-bottom: 1px solid #f3f4f6;">${duration || "Not provided"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #4b5563;">Nature of Work:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${natureOfWork || "Not provided"}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>
            </td>
          </tr>

          <!-- Section 6: Course Preference -->
          <tr>
            <td style="padding: 0 20px 20px 20px;">
              <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 15px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                <h2 style="font-size: 18px; font-weight: bold; color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin: 0 0 15px 0;">Course Preference</h2>
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #4b5563; width: 40%;">PGDM Specialization:</td>
                    <td style="padding: 8px 0; color: #3b82f6; width: 60%; font-weight: bold; font-size: 16px;">${specialization || "Not provided"}</td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Section 7: Declaration -->
          <tr>
            <td style="padding: 0 20px 20px 20px;">
              <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin-bottom: 15px;">
                <h2 style="font-size: 18px; font-weight: bold; color: #22c55e; margin: 0 0 10px 0;">Declaration Status</h2>
                <p style="margin: 0; color: #1f2937; font-size: 14px;">✓ Candidate has accepted the declaration</p>
              </div>
            </td>
          </tr>



          <!-- Footer -->
          <tr>
            <td style="background-color: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 10px 0;">IMM Business School - PGDM Admissions</p>
              <p style="margin: 0 0 10px 0;">This is an automated email. Please do not reply.</p>
              <p style="margin: 0;">Application submitted at: ${submissionDate}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function POST(request) {
  try {
    const formData = await request.formData();

    // Extract all form fields
    const data = {
      fullName: formData.get("fullName") || "",
      gender: formData.get("gender") || "",
      nationality: formData.get("nationality") || "",
      aadhaarNumber: formData.get("aadhaarNumber") || "",
      mobileNumber: formData.get("mobileNumber") || "",
      alternateMobileNumber: formData.get("alternateMobileNumber") || "",
      email: formData.get("email") || "",
      city: formData.get("city") || "",
      state: formData.get("state") || "",
      fathersName: formData.get("fathersName") || "",
      fathersMobileNumber: formData.get("fathersMobileNumber") || "",
      fathersOccupation: formData.get("fathersOccupation") || "",
      annualFamilyIncome: formData.get("annualFamilyIncome") || "",
      tenthBoard: formData.get("tenthBoard") || "",
      tenthPercentage: formData.get("tenthPercentage") || "",
      twelfthBoard: formData.get("twelfthBoard") || "",
      twelfthYear: formData.get("twelfthYear") || "",
      twelfthPercentage: formData.get("twelfthPercentage") || "",
      graduationDegree: formData.get("graduationDegree") || "",
      graduationYear: formData.get("graduationYear") || "",
      graduationPercentage: formData.get("graduationPercentage") || "",
      entranceExamName: formData.get("entranceExamName") || "",
      entranceExamScore: formData.get("entranceExamScore") || "",
      hasWorkExperience: formData.get("hasWorkExperience") || "",
      organizationName: formData.get("organizationName") || "",
      designation: formData.get("designation") || "",
      duration: formData.get("duration") || "",
      natureOfWork: formData.get("natureOfWork") || "",
      specialization: formData.get("specialization") || "",
      declaration: formData.get("declaration") === "true" || false,
    };

    // Validate required fields
    if (!data.fullName || !data.email || !data.mobileNumber) {
      return NextResponse.json(
        { message: "Missing required fields: fullName, email, mobileNumber" },
        { status: 400 }
      );
    }

    // No file attachments needed
    const attachments = [];

    // Setup nodemailer transporter
    const port = Number(process.env.EMAIL_PORT) || Number(process.env.SMTP_PORT) || 587;
    const secure = resolveBoolean(process.env.EMAIL_SECURE, false) || Number(port) === 465;

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || process.env.SMTP_HOST,
      port,
      secure,
      auth: {
        user: process.env.EMAIL_USER || process.env.SMTP_USER,
        pass: process.env.EMAIL_PASSWORD || process.env.SMTP_PASS,
      },
    });

    const fromEmail =
      process.env.EMAIL_USER || process.env.SMTP_USER || "noreply@immindia.edu.in";
    // Send to both email addresses
    const toEmails = [
      process.env.EMAIL_TO || "it@stealthdigital.in",
      "rashmi@immindia.edu.in"
    ];

    // Generate application ID and submission date
    const applicationId = `PGDM${Date.now()}`;
    const submissionDate = formatDate(new Date());

    // Generate HTML email template
    const html = generateEmailTemplate(data, applicationId, submissionDate);

    // Create plain text version
    const text = `New PGDM Admission Application ${applicationId}\n\nApplicant: ${data.fullName}\nEmail: ${data.email}\nMobile: ${data.mobileNumber}\n\nSubmitted at: ${submissionDate}\n\nPlease check the email for complete details and attachments.`;

    // Send email
    await transporter.sendMail({
      from: `PGDM Admissions <${fromEmail}>`,
      to: toEmails,
      subject: `New PGDM Admission Application - ${data.fullName} (${applicationId})`,
      html,
      text,
      replyTo: data.email,
      attachments,
    });

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      applicationId: applicationId,
    });
  } catch (error) {
    console.error("/api/submit-admission POST error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to submit application",
      },
      { status: 500 }
    );
  }
}

