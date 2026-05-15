import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sessions, users } from "@/lib/schema";
import { eq, and, lt, gte } from "drizzle-orm";
import { sendEmail } from "@/lib/email";

// This endpoint can be called by a cron job to send reminders for upcoming sessions
export async function GET() {
  try {
    // Find sessions scheduled in the next 24 hours that haven't had reminders sent
    const tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours() + 24);

    const dayAfter = new Date();
    dayAfter.setHours(dayAfter.getHours() + 48);

    const upcomingSessions = await db
      .select()
      .from(sessions)
      .where(
        and(
          gte(sessions.scheduledAt, tomorrow),
          lt(sessions.scheduledAt, dayAfter),
          eq(sessions.status, "confirmed")
        )
      );

    const remindersSent = [];

    for (const session of upcomingSessions) {
      // Check if reminder already sent (you might want to add a reminderSent field to sessions table)
      // For now, we'll send reminders every time this runs

      const [founder] = await db.select().from(users).where(eq(users.clerkId, session.founderClerkId)).limit(1);
      const [expert] = await db.select().from(users).where(eq(users.clerkId, session.expertClerkId)).limit(1);

      if (founder?.email) {
        const meetingUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ""}${session.meetingUrl || `/session-room/${session.id}`}`;
        const subject = "Session reminder - Tomorrow";
        const text = `Reminder: Your session with ${session.expertName} is scheduled for tomorrow at ${new Date(session.scheduledAt).toLocaleString()}. Join: ${meetingUrl}`;

        await sendEmail({ to: founder.email, subject, text });
        remindersSent.push({ sessionId: session.id, to: founder.email, role: "founder" });
      }

      if (expert?.email) {
        const meetingUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ""}${session.meetingUrl || `/session-room/${session.id}`}`;
        const subject = "Session reminder - Tomorrow";
        const text = `Reminder: Your session with ${session.founderName} is scheduled for tomorrow at ${new Date(session.scheduledAt).toLocaleString()}. Join: ${meetingUrl}`;

        await sendEmail({ to: expert.email, subject, text });
        remindersSent.push({ sessionId: session.id, to: expert.email, role: "expert" });
      }
    }

    return NextResponse.json({
      message: `Sent ${remindersSent.length} reminders`,
      reminders: remindersSent
    });
  } catch (error) {
    console.error("Reminder sending failed:", error);
    return NextResponse.json({ error: "Failed to send reminders" }, { status: 500 });
  }
}