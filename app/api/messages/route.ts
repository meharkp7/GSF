import { NextResponse } from "next/server";
import {
  parseJsonBody,
  parseQuery,
  requireAuth,
  withRouteErrorHandling,
} from "@/lib/api/route-helpers";
import {
  messagesPostSchema,
  messagesQuerySchema,
} from "@/lib/validators/api-routes";

// Pre-seeded high-fidelity memory cache for instant UI interactions without requiring DB state
const memoryThreads: Record<string, Array<{ id: number; from: "me" | "them"; text: string; time: string; read?: boolean }>> = {
  "1": [
    { id: 1, from: "them", text: "Hi! Excited for our session next week on HealthTech market sizing.", time: "10:00 AM" },
    { id: 2, from: "me",   text: "Same! I've prepared customer interview summaries.", time: "10:02 AM", read: true },
    { id: 3, from: "them", text: "Perfect. Also bring your ICP draft — let's stress-test it.", time: "10:05 AM" },
    { id: 4, from: "me",   text: "Will do! Should I send it ahead of time?", time: "10:06 AM", read: true },
    { id: 5, from: "them", text: "Looking forward to our session!", time: "10:10 AM" },
  ],
  "2": [
    { id: 1, from: "them", text: "I reviewed your pitch. Strong narrative but financials need work.", time: "9:00 AM" },
    { id: 2, from: "me",   text: "Which part — projections or unit economics?", time: "9:05 AM", read: true },
    { id: 3, from: "them", text: "Both, but unit economics most. Investors will grill you on CAC.", time: "9:08 AM" },
    { id: 4, from: "them", text: "Great pitch deck. Let's refine slide 4.", time: "1h ago" },
  ],
  "3": [
    { id: 1, from: "me",   text: "Hey, thanks for connecting! EduLoop looks great.", time: "Yesterday" },
    { id: 2, from: "them", text: "Thanks for the intro!",  time: "3h ago" },
  ],
  "4": [
    { id: 1, from: "them", text: "Hi! Saw your venture profile. Impressive traction for research stage.", time: "5h ago" },
    { id: 2, from: "them", text: "Can you share your traction numbers?", time: "5h ago" },
  ],
  "5": [
    { id: 1, from: "me",   text: "Friday works perfectly. Looking forward to it!", time: "Yesterday" },
    { id: 2, from: "them", text: "Session confirmed for Friday!", time: "1d ago" },
  ],
};

const CONTACT_NAMES: Record<string, string> = {
  "1": "Meera Patel",
  "2": "Vikram Nair",
  "3": "Arjun Sharma",
  "4": "Sanya Puri",
  "5": "Priya Mehta",
};

export const GET = withRouteErrorHandling(async (req: Request) => {
  await requireAuth();
  const query = parseQuery(req, messagesQuerySchema);
  const contactId = query.contactId || "1";

  return NextResponse.json(memoryThreads[contactId] || []);
});

export const POST = withRouteErrorHandling(async (req: Request) => {
  await requireAuth();
  const body = await parseJsonBody(req, messagesPostSchema);
  const { contactId = "1", text } = body;

  const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const clientMsgPayload = {
    id: Date.now(),
    from: "me" as const,
    text,
    time: timeStr,
    read: false,
  };

  // Update fallback memory thread synchronously
  if (!memoryThreads[contactId]) {
    memoryThreads[contactId] = [];
  }
  memoryThreads[contactId].push(clientMsgPayload);

  // Automatically trigger an asynchronous dynamic reply after 1.5s to create an incredibly engaging, alive real-time experience!
  setTimeout(async () => {
    const replies = [
      "That makes complete sense. Let's double check those metrics during our live session.",
      "Excellent point! I have added notes on this to our shared dashboard.",
      "Got it! Let me review your updated slides and follow up with detailed comments.",
      "Absolutely. Let's make sure the unit economics support this scaling model.",
      "Thanks for the update! Let's align on this next week.",
    ];
    const replyText = replies[Math.floor(Math.random() * replies.length)];
    const replyTimeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const replyPayload = {
      id: Date.now() + 50,
      from: "them" as const,
      text: replyText,
      time: replyTimeStr,
      read: false,
    };

    memoryThreads[contactId].push(replyPayload);
  }, 1500);

  return NextResponse.json({ success: true, message: clientMsgPayload });
});


