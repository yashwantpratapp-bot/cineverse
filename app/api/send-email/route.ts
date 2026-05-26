import { Resend } from "resend";

import { NextResponse } from "next/server";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function POST(
  req: Request
) {

  try {

    const body =
      await req.json();

    const {
      email,
      title,
      message,
    } = body;

    await resend.emails.send({

      from:
        "Cineverse <onboarding@resend.dev>",

      to: email,

      subject: title,

      html: `
        <div style="font-family:sans-serif;padding:20px">
          <h1>${title}</h1>
          <p>${message}</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      success: false,
    });
  }
}