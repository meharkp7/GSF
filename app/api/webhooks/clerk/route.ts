import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

type ClerkEvent = {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{ email_address: string }>;
    first_name?: string;
    last_name?: string;
    image_url?: string;
    public_metadata?: Record<string, unknown>;
    unsafe_metadata?: Record<string, unknown>;
  };
};

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const headersList = await headers();
  const svixId = headersList.get("svix-id");
  const svixTimestamp = headersList.get("svix-timestamp");
  const svixSignature = headersList.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error("Missing Svix headers");
    return NextResponse.json(
      { error: "Missing Svix headers" },
      { status: 400 }
    );
  }

  const body = await req.text();

  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    const evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkEvent;

    const clerkUserId = evt.data.id;
    const email =
      evt.data.email_addresses?.[0]?.email_address || "no-email@clerk.local";
    const firstName = evt.data.first_name || "";
    const lastName = evt.data.last_name || "";
    const imageUrl = evt.data.image_url || null;
    const publicMetadata = evt.data.public_metadata || {};
    const unsafeMetadata = evt.data.unsafe_metadata || {};

    if (evt.type === "user.created") {
      await db.insert(users).values({
        clerkUserId,
        email,
        firstName,
        lastName,
        imageUrl,
        publicMetadata,
        unsafeMetadata,
      });

      console.log(`✅ User created: ${clerkUserId}`);
    } else if (evt.type === "user.updated") {
      await db
        .update(users)
        .set({
          email,
          firstName,
          lastName,
          imageUrl,
          publicMetadata,
          unsafeMetadata,
          updatedAt: new Date(),
        })
        .where(eq(users.clerkUserId, clerkUserId));

      console.log(`✅ User updated: ${clerkUserId}`);
    } else {
      console.log(`⏭️  Event type not handled: ${evt.type}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    );
  }
}
