import { db } from "../lib/db";
import { users, expertProfiles } from "../lib/schema";
import { eq } from "drizzle-orm";

async function checkExperts() {
  const allExperts = await db
    .select()
    .from(users)
    .innerJoin(expertProfiles, eq(users.clerkId, expertProfiles.clerkUserId))
    .where(eq(users.role, "expert"));
  
  console.log("Found experts:", allExperts.length);
  if (allExperts.length > 0) {
    console.log(JSON.stringify(allExperts, null, 2));
  } else {
    // If no experts, maybe I should create a mock one for testing
    console.log("No experts found in DB.");
  }
}

checkExperts().catch(console.error);
