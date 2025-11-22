import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/EmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { subject, body, to } = await req.json();

    // Validate input
    if (!subject && !body) {
      return NextResponse.json(
        { error: "Subject or body is required" },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Your App <onboarding@resend.dev>",
      to: to || "daiwiikharihar17147@gmail.com",
      subject: subject || "No Subject",
      react: EmailTemplate({
        subject: subject || "No Subject",
        body: body || "",
      }),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data,
      message: "Email sent successfully!",
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Failed to send email", details: (error as Error).message },
      { status: 500 }
    );
  }
}
