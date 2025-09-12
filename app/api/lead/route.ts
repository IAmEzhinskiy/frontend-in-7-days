import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({ email: z.string().email(), source: z.string().optional() });

export async function POST(req: Request) {
  try {
    const { email, source } = schema.parse(await req.json());

    const resend = new Resend(process.env.RESEND_API_KEY!);
    const ownerEmail = process.env.OWNER_EMAIL || "iamezhinskiy@gmail.com";
    const from = process.env.MAIL_FROM || "Frontend in 7 Days <onboarding@resend.dev>";

    // 1) Уведомляем владельца — это критично: если не ушло, возвращаем ошибку
    const notify = await resend.emails.send({
      from,
      to: ownerEmail,
      subject: "New lead — Frontend in 7 Days",
      reply_to: email,
      text: `New lead for Frontend in 7 Days\nEmail: ${email}\nSource: ${source || "n/a"}`
    });
    // SDK Resend возвращает объект с полем error
    // @ts-ignore
    if (notify?.error) throw new Error(notify.error?.message || "Owner notification failed");

    // 2) Пытаемся отправить автоответ пользователю — НЕ валим весь запрос, если не получилось
    let autoReply: "ok" | "failed" = "ok";
    try {
      const auto = await resend.emails.send({
        from,
        to: email,
        subject: "Your Frontend in 7 Days request was received",
        text:
          `Thanks for your interest!\n\n` +
          `We received your request for the Frontend in 7 Days guide ($120 — launch discount from $250). ` +
          `We will contact you shortly to arrange payment, send the guide, and schedule your free 60-minute consultation if you would like.\n\n` +
          `If you have any questions, just reply to this email.`
      });
      // @ts-ignore
      if (auto?.error) {
        console.error("Auto-reply error:", auto.error);
        autoReply = "failed";
      }
    } catch (e) {
      console.error("Auto-reply exception:", e);
      autoReply = "failed";
    }

    // Успешный ответ — лид сохранён (ты получил письмо). Автоответ может быть "failed".
    return NextResponse.json({ ok: true, autoReply });
  } catch (err: any) {
    return new NextResponse(err?.message || "Invalid request", { status: 400 });
  }
}
