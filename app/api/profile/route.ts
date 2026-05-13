// app/api/profile/route.ts
// GET  → returns Clerk user data + unsafeMetadata (bio, location, links)
// PATCH → updates Clerk unsafeMetadata via clerkClient

import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { errorResponse, parseJsonBody, withRouteErrorHandling } from "@/lib/api/route-helpers";
import { profilePatchSchema } from "@/lib/validators/api-routes";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return errorResponse(401, "Unauthorized", { code: "UNAUTHORIZED" });

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);

  return NextResponse.json({
    id:            user.id,
    name:          `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
    email:         user.emailAddresses[0]?.emailAddress ?? "",
    imageUrl:      user.imageUrl,
    role:          user.publicMetadata?.role ?? "founder",
    credits:       user.publicMetadata?.credits ?? 600,
    plan:          user.publicMetadata?.plan ?? "free",
    // editable extras stored in unsafeMetadata
    bio:           user.unsafeMetadata?.bio ?? "",
    university:    user.unsafeMetadata?.university ?? "",
    year:          user.unsafeMetadata?.year ?? "",
    location:      user.unsafeMetadata?.location ?? "",
    linkedin:      user.unsafeMetadata?.linkedin ?? "",
    website:       user.unsafeMetadata?.website ?? "",
  });
}

export const PATCH = withRouteErrorHandling(async (req: Request) => {
  const { userId } = await auth();
  if (!userId) return errorResponse(401, "Unauthorized", { code: "UNAUTHORIZED" });

  const body = await parseJsonBody(req, profilePatchSchema);
  const { bio, university, year, location, linkedin, website, name } = body;

  const clerk = await clerkClient();

  // Update display name if provided
  if (name) {
    const parts = (name as string).split(" ");
    await clerk.users.updateUser(userId, {
      firstName: parts[0] ?? "",
      lastName:  parts.slice(1).join(" ") ?? "",
    });
  }

  // Update unsafeMetadata (editable by user)
  const user = await clerk.users.getUser(userId);
  await clerk.users.updateUser(userId, {
    unsafeMetadata: {
      ...user.unsafeMetadata,
      ...(bio        !== undefined && { bio }),
      ...(university !== undefined && { university }),
      ...(year       !== undefined && { year }),
      ...(location   !== undefined && { location }),
      ...(linkedin   !== undefined && { linkedin }),
      ...(website    !== undefined && { website }),
    },
  });

  return NextResponse.json({ ok: true });
});
