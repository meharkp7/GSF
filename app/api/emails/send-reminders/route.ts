import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sessions, users, notifications } from "@/lib/schema";
import { and, gte, lt, eq } from "drizzle-orm";
import { sendEmail } from "@/lib/email";

// GET: run reminders for sessions happening within the next 24 hours
export async function GET() {
  const now = new Date();
  const later = new Date(Date.now() + 24 * 60 * 60 * 1000);

  try {
    const rows = await db
      .select()
      .from(sessions)
      .where(and(gte(sessions.scheduledAt, now), lt(sessions.scheduledAt, later)));

    for (const s of rows) {
      try {
        // Check if we've already sent a reminder for this session
        const existing = await db
          .select()
          .from(notifications)
          .where(and(eq(notifications.sessionId, s.id), eq(notifications.type, "reminder")))
          .limit(1);

        if (existing.length > 0) continue;

        const [founder] = await db.select().from(users).where(eq(users.clerkId, s.founderClerkId)).limit(1);
        const [expert] = await db.select().from(users).where(eq(users.clerkId, s.expertClerkId)).limit(1);

        const meetingUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ""}${s.meetingUrl || `/session-room/${s.id}`}`;
        const subject = "Session reminder";
        const text = `Reminder: your session between ${s.founderName || "founder"} and ${s.expertName || "expert"} is scheduled at ${new Date(s.scheduledAt).toLocaleString()}. Join: ${meetingUrl}`;

        if (founder?.email) {
          await sendEmail({ to: founder.email, subject, text });
          await db.insert(notifications).values({
            sessionId: s.id,
            toEmail: founder.email,
            type: "reminder",
            status: "sent",
            payload: { role: "founder" },
            sentAt: new Date(),
          }).catch(() => {});
        }

        if (expert?.email) {
          await sendEmail({ to: expert.email, subject, text });
          await db.insert(notifications).values({
            sessionId: s.id,
            toEmail: expert.email,
            type: "reminder",
            status: "sent",
            payload: { role: "expert" },
            sentAt: new Date(),
          }).catch(() => {});
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Failed to send reminder for session", s.id, e);
      }
    }

    return NextResponse.json({ ok: true, count: rows.length });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Reminders job failed", e);
    return NextResponse.json({ error: "Reminders job failed" }, { status: 500 });
  }
}
