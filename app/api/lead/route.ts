import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({ email: z.string().email(), source: z.string().optional() });

export async function POST(req: Request) {
  try {
    const { email, source } = schema.parse(await req.json());
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const ownerEmail = process.env.OWNER_EMAIL || "iamezhinskiy@gmail.com";
    const from = process.env.MAIL_FROM || "Frontend in 7 Days <no-reply@yourdomain.com>";

    const notify = await resend.emails.send({ from, to: ownerEmail, subject: "New lead — Frontend in 7 Days", reply_to: email, text: `New lead for Frontend in 7 Days\nEmail: ${email}\nSource: ${source || "n/a"}` });
    const autoreply = await resend.emails.send({ from, to: email, subject: "Your Frontend in 7 Days request was received", text: `Thanks for your interest!\n\nWe received your request for the Frontend in 7 Days guide ($120 — launch discount from $250). We will contact you shortly to arrange payment, send the guide, and schedule your free 60-minute consultation if you would like.\n\nIf you have any questions, just reply to this email.` });

    if ((notify as any).error || (autoreply as any).error) throw new Error("Email send failed");
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return new NextResponse(err?.message || "Invalid request", { status: 400 });
  }
}
