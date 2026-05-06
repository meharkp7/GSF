"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Zap, TrendingUp, BookOpen, Users, ArrowRight, Calendar, Clock, ChevronRight, X, Shield, Lock, Mail, Plus } from "lucide-react";
import { useUser } from "@clerk/nextjs";

const CATEGORIES = ["All", "Founder Strategy", "Fundraising", "Product", "Community", "Growth"];

type Article = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  featured: boolean;
  gradient: string;
  accentColor: string;
};

const ARTICLES: Article[] = [
  // ── Founder Strategy ─────────────────────────────────────────────────────
  {
    id: "fs1",
    category: "Founder Strategy",
    title: "The 7-Stage Founder Journey: From Ideation to PMF",
    excerpt: "Most founders skip stages. Here's why the GSF 7-stage framework works — and how to navigate each one without burning out.",
    content: `Most founders fail not because they lack ideas, but because they skip stages. The GSF 7-stage framework isn't a checklist — it's a forcing function.

**Stage 1 — Ideation**
Ideas are cheap. The goal at this stage isn't to find the *best* idea, it's to develop the habit of noticing problems. Carry a problem journal. Write down 3 problems you observe every day for 30 days.

**Stage 2 — Idea Screening**
Filter your list with 3 questions: (1) Do I care enough about this to work on it for 5 years? (2) Is this a real problem or a solution looking for a problem? (3) Can this reach ₹1Cr revenue within 24 months?

**Stage 3 — Market Research**
Talk to 50 potential users before writing a single line of code. Not surveys — actual 20-minute conversations. Record them. Transcribe them. Patterns will emerge.

**Stage 4 — MVP**
Build the simplest thing that proves your core hypothesis. Not the product you want to build — the evidence you need to collect.

**Stage 5 — Investment & Funding**
Raise when you have traction, not when you need money. The best fundraising pitch is a growing graph, not a beautiful deck.

**Stage 6 — Company Launch**
Launch publicly before you're ready. You'll learn more in week 1 post-launch than in 6 months of building.

**Stage 7 — Product-Market Fit**
PMF isn't a moment — it's a feeling. Users tell others without being asked. Retention curves flatten. NPS crosses 50.

The founders who succeed fastest are those who resist the urge to jump stages.`,
    author: "Aryan Kapoor", authorRole: "GSF Team · aryan@gsf.co",
    date: "Apr 8, 2026", readTime: "7 min", featured: true,
    gradient: "135deg, rgba(91,108,255,0.10) 0%, rgba(79,209,197,0.06) 100%",
    accentColor: "#5B6CFF",
  },
  {
    id: "fs2",
    category: "Founder Strategy",
    title: "Equity 101: What Every Student Founder Must Know Before Offering Shares",
    excerpt: "Don't give away 50% of your company before you've validated a single hypothesis. A guide to equity decisions for early-stage student founders.",
    content: `One of the most costly mistakes student founders make is giving equity too early, too much, and without legal structure.

**The fundamental rule:** Never offer equity until you've validated that the problem is real and people will pay for your solution.

**Co-founder equity splits**
The most common mistake: splitting 50/50 with a friend. This feels fair, but consider these questions first:
- Who is making the full-time commitment?
- Who has the domain expertise?
- Who has the personal runway to survive 18 months without salary?

A common framework is dynamic equity — vesting over 4 years with a 1-year cliff. This protects everyone.

**Advisor equity**
Advisors typically get 0.1%–0.5% over a 2-year vesting schedule. Never give above 1%. Never give without a vesting cliff. Get it documented.

**Investor equity (pre-seed/angel)**
At pre-seed, typically 5%–15% for your first check. If an investor wants 20%+ on the first check without a massive cheque, walk.

**Never do this:**
- Issue equity verbally
- Skip a share purchase agreement
- Ignore an IP assignment agreement
- Add people to your cap table without understanding dilution

Your cap table is your company. Guard it accordingly.`,
    author: "Meera Krishnan", authorRole: "GSF Team · meera@gsf.co",
    date: "Mar 19, 2026", readTime: "11 min", featured: false,
    gradient: "135deg, rgba(239,68,68,0.07) 0%, rgba(239,68,68,0.03) 100%",
    accentColor: "#EF4444",
  },
  {
    id: "fs3",
    category: "Founder Strategy",
    title: "The Founder's Guide to Saying No Without Burning Bridges",
    excerpt: "Every yes to a bad opportunity is a no to the right one. How to decline gracefully, maintain relationships, and protect your focus.",
    content: `As a founder, your most scarce resource isn't money — it's attention. Learning to say no is a survival skill.

**Why founders say yes too often**
Fear of missing out (FOMO), fear of offending, and the optimistic belief that "this might lead somewhere" are the three main culprits.

**The 3-filter test before every yes:**
1. Does this directly move me closer to PMF or funding in the next 30 days?
2. Would I regret not doing this in 12 months?
3. Would my co-founder (or advisor) think this is a good use of a full day?

If it fails 2 of 3 — decline.

**Script for gracefully declining:**
> "I really appreciate you thinking of me. I'm at a critical stage with [venture] right now and I've made a strict rule to protect my build-time. I'll keep you in mind once we're past our current milestone."

This is honest, specific, and leaves the door open.

**Partnerships and collabs**
Most "partnership" asks from other early-stage founders are actually "help me grow while I figure out what I'm doing." These almost never produce outcomes for you.

The only partnerships worth saying yes to are ones where there's a clear, time-bounded deliverable and a shared customer.

Protecting your time is respecting your idea.`,
    author: "Ravi Shankar", authorRole: "GSF Team · ravi@gsf.co",
    date: "Mar 5, 2026", readTime: "5 min", featured: false,
    gradient: "135deg, rgba(245,158,11,0.07) 0%, rgba(245,158,11,0.03) 100%",
    accentColor: "#F59E0B",
  },

  // ── Fundraising ───────────────────────────────────────────────────────────
  {
    id: "fr1",
    category: "Fundraising",
    title: "How to Close Your First Angel Round Without a Warm Intro",
    excerpt: "Cold outreach works — if you know what you're doing. A step-by-step playbook from a founder who raised $80K without knowing a single VC.",
    content: `The myth: "You can't raise without warm intros."

The reality: Cold outreach works — if you know what you're doing.

**Step 1: Build your target list**
Don't target 500 investors. Target 30 angels who have (a) invested in your sector within the last 2 years, (b) a thesis that matches your stage, and (c) a public email or LinkedIn.

**Step 2: Write a cold email that leads with evidence**
Don't open with your idea. Open with the most interesting data point about your traction.

> "Hi [Name], I'm building [Company] — we've hit ₹40K MRR in month 3, with zero paid marketing, in the [specific segment]. I think our retention data would interest you. Would a 15-minute call make sense?"

That's it. No pitch deck in the first email. No life story.

**Step 3: The follow-up rhythm**
Day 0: Send email.
Day 5: One follow-up ("Just bubbling this up in case it got buried.").
Day 14: Final follow-up with a new data point.

3 touches. Then move on.

**What to send when they say yes:**
- 1-pager (not a 20-slide deck)
- MoM growth graph
- One page on team + why us

**The real close**
Urgency is the closer. "We're filling a ₹15L angel round — currently ₹10L committed. Looking for the last ₹5L from 2 aligned angels before [date]."

This isn't fake — if you've got 10L committed, that's real urgency. Fill the round in tranches.`,
    author: "Aryan Kapoor", authorRole: "GSF Team · aryan@gsf.co",
    date: "Apr 5, 2026", readTime: "9 min", featured: false,
    gradient: "135deg, rgba(245,158,11,0.08) 0%, rgba(245,158,11,0.04) 100%",
    accentColor: "#F59E0B",
  },
  {
    id: "fr2",
    category: "Fundraising",
    title: "What Investors Actually Read in Your Pitch Deck",
    excerpt: "An honest breakdown from a VC who's seen 600+ decks: where investors spend their time, what kills deals, and what you're almost certainly doing wrong.",
    content: `I've reviewed 600+ pitch decks in 4 years. Here's what I actually read — and in what order.

**Slide 1: The Hook (1 sentence)**
"We're the X for Y" is dead. Give me one sentence that tells me the size of the problem and your unfair advantage.

**Slide 2: The Problem**
Is this a problem people are *actively* trying to solve or just mildly annoyed by? Show me evidence of pain, not just frustration.

**Slide 3: The Solution**
Show a demo screenshot, not a wireframe. I want to see that something exists.

**Slide 4: Traction** ← This is the only slide that actually matters at pre-seed.
Month-over-month growth. User numbers. Revenue if you have it. Retention curves. Anything that shows the idea isn't theoretical.

**Slide 5: Market**
I don't care about the global TAM from a McKinsey report. Show me your actual serviceable addressable market and why you can own 1% of it in 3 years.

**Slide 6: Team**
Why are *you* the people to solve this? Specific domain experience, founder-market fit, anything that isn't "we're a passionate and hardworking team."

**Slides I skip when a deck is bad:**
- Long vision slides
- "Why now" with obvious trends
- Competitor grids where you tick every box

**What kills deals:**
- Revenue projections that go from ₹5L to ₹50Cr in 3 years with no explanation
- "No real competition" on your competitor slide
- 25+ slides

Keep it under 12. Move fast.`,
    author: "Meera Krishnan", authorRole: "GSF Team · meera@gsf.co",
    date: "Mar 12, 2026", readTime: "8 min", featured: false,
    gradient: "135deg, rgba(16,185,129,0.07) 0%, rgba(16,185,129,0.03) 100%",
    accentColor: "#10B981",
  },
  {
    id: "fr3",
    category: "Fundraising",
    title: "The SAFE Note vs Equity Round: Which One for Your Stage?",
    excerpt: "Most student founders don't understand what they're signing. A plain-English breakdown of SAFE notes, valuation caps, and why getting this wrong is expensive.",
    content: `A SAFE (Simple Agreement for Future Equity) is how most Indian and global early-stage rounds happen now. Here's what you need to know.

**What is a SAFE?**
A SAFE is a contract where an investor gives you money today in exchange for the right to receive equity later — typically when you raise a priced round.

It's *not* a loan. There's no interest. No repayment.

**The valuation cap**
The most important clause. If your SAFE has a ₹3Cr valuation cap and you raise a Series A at ₹15Cr, your angel investor gets shares at the lower ₹3Cr price.

This is the investor's reward for taking early risk. Don't negotiate this away.

**Discount rate**
Many SAFEs include a 15–25% discount on the next round price. This compounds with the cap, so watch for double-dipping.

**MFN (Most Favoured Nation) clause**
If you issue better terms to a later SAFE investor, the MFN clause requires you to offer those terms to existing SAFE holders. Standard practice — include it.

**When to do a priced round instead**
When you raise more than ₹1–2Cr in a single close, institutional investors typically want a priced round (actual share issuance) rather than a SAFE.

**NEVER do this:**
- Sign a SAFE without a lawyer reviewing
- Agree to uncapped SAFEs early (massive dilution risk)
- Forget to get your SAFE investors' counter-signatures

Always, always get legal counsel before you sign anything cap table-related.`,
    author: "Ravi Shankar", authorRole: "GSF Team · ravi@gsf.co",
    date: "Feb 28, 2026", readTime: "10 min", featured: false,
    gradient: "135deg, rgba(139,92,246,0.07) 0%, rgba(139,92,246,0.03) 100%",
    accentColor: "#8B5CF6",
  },

  // ── Product ───────────────────────────────────────────────────────────────
  {
    id: "pr1",
    category: "Product",
    title: "Customer Discovery Interviews That Actually Teach You Something",
    excerpt: "The biggest mistake students make: asking what people want instead of understanding what they're struggling with. Here's how to fix it.",
    content: `Customer interviews are the most misused tool in a student founder's arsenal. Here's why they fail — and how to fix them.

**The #1 mistake: asking about the future**
"Would you use this app?" → Useless.
"What did you do the last time you faced [problem]?" → Gold.

People are terrible at predicting their own behaviour. They're excellent at recounting their past actions.

**The interview framework that works:**
1. Open with: "Tell me about the last time you [faced the problem area]."
2. Probe: "What did you do? What tools/workarounds did you use? How did that feel?"
3. Dig: "What was the hardest part of that process?"
4. End with: "Who else do you know that faces this?" ← This is how you find your next interviewee.

Never mention your solution in the first 15 minutes. You're not validating your idea — you're understanding their reality.

**Signs you've found a real problem:**
- They've tried multiple imperfect solutions
- They use emotional language ("I hate it", "it drives me crazy")
- They've already paid someone or something to partially solve it

**Signs the problem isn't real enough:**
- "Yeah, that's a bit annoying sometimes"
- They've never tried to solve it themselves
- They're talking about it as someone else's problem

**Aim for 30 interviews before building anything**
In those 30 conversations, you'll hear the same 3–4 problems in different words. Those are your signal.`,
    author: "Aryan Kapoor", authorRole: "GSF Team · aryan@gsf.co",
    date: "Apr 2, 2026", readTime: "5 min", featured: false,
    gradient: "135deg, rgba(16,185,129,0.08) 0%, rgba(16,185,129,0.04) 100%",
    accentColor: "#10B981",
  },
  {
    id: "pr2",
    category: "Product",
    title: "Building Your MVP: The 80% Rule That Saves Founders 6 Months",
    excerpt: "Your MVP isn't version 0.1 of your dream product. It's the fastest way to prove one hypothesis. Most founders don't know the difference.",
    content: `The Minimum Viable Product is the most misunderstood concept in startup culture.

**What it is NOT:**
- A stripped-down version of your full product
- Something you'd be embarrassed to show investors
- A prototype with most features removed

**What it IS:**
- The simplest thing that proves your core hypothesis
- Something real people can use to get real value
- A learning machine, not a product machine

**The 80% rule:**
Before building anything, answer: "What is the one assumption, if proven wrong, would invalidate this entire business?"

That assumption should take 80% of your MVP effort to test. Everything else is distraction.

**Real examples:**
- Dropbox's MVP was a 4-minute demo video (no product)
- Airbnb's MVP was a WordPress site and a DSLR camera
- Zappos' MVP was manually buying shoes from stores when orders came in

None of these involved building the actual product first.

**The MVP sprint framework:**
Week 1: Write your core hypothesis in one sentence.
Week 2: Design the simplest test (not necessarily digital).
Week 3: Get 5 people to use it.
Week 4: Analyse and decide: pivot, persevere, or stop.

One month. Not 6.

**The question to ask at every build decision:**
"Does this help us prove or disprove our hypothesis faster?" If no — cut it.`,
    author: "Meera Krishnan", authorRole: "GSF Team · meera@gsf.co",
    date: "Mar 25, 2026", readTime: "6 min", featured: false,
    gradient: "135deg, rgba(6,182,212,0.08) 0%, rgba(6,182,212,0.04) 100%",
    accentColor: "#06B6D4",
  },
  {
    id: "pr3",
    category: "Product",
    title: "Metrics That Matter: What to Track in Your First 100 Days",
    excerpt: "Vanity metrics will kill you slowly. The 5 metrics every early-stage founder should track obsessively — and the 10 they should ignore completely.",
    content: `Data is only useful if you're measuring the right things. After 100 days, most founders are watching the wrong numbers.

**The 5 metrics that matter (pick 1–2 to obsess over at your stage):**

1. **Week 1 Retention** — Of users who signed up this week, how many came back next week? If < 20%, your core value proposition isn't landing.

2. **Activation Rate** — What % of newly signed-up users complete your "aha moment" action? (e.g., creating their first project, making their first payment). This is your biggest growth lever.

3. **NPS (Net Promoter Score)** — "How likely are you to recommend us to a friend?" (0–10). Goal at early stage: > 40. < 20 means something is fundamentally broken.

4. **CAC vs LTV** — Customer Acquisition Cost vs Lifetime Value. You need LTV > 3× CAC to have a sustainable business. Most student founders don't know either number.

5. **Burn Rate** — How many months of runway do you have? Always know this number. If you're down to 3 months and haven't raised, it's a crisis.

**10 vanity metrics to ignore:**
- Total app downloads
- Social media followers
- Press mentions
- Time on site (without context)
- Email open rates (in isolation)
- Demo requests without conversion data
- New user signups (without retention)
- Competitor comparison traffic
- LinkedIn post impressions
- "Revenue pipeline" (unbooked)

Track fewer metrics. Know them cold. Make one decision from each per week.`,
    author: "Ravi Shankar", authorRole: "GSF Team · ravi@gsf.co",
    date: "Mar 10, 2026", readTime: "7 min", featured: false,
    gradient: "135deg, rgba(245,158,11,0.08) 0%, rgba(245,158,11,0.04) 100%",
    accentColor: "#F59E0B",
  },

  // ── Community ─────────────────────────────────────────────────────────────
  {
    id: "cm1",
    category: "Community",
    title: "Why Your Network Is Your Most Underutilised Asset",
    excerpt: "The students who succeed fastest aren't the smartest — they're the most connected. Here's how to build a founder network that opens doors.",
    content: `Every significant breakthrough in your founder journey will come from a person, not a Google search.

The students who move fastest through the GSF stages are rarely the smartest in the room. They're the most connected.

**The anatomy of a useful founder network:**
- 5 founders at a similar or slightly ahead stage (peers)
- 3 domain experts who've built what you're building (advisors)
- 2 potential investors who've backed your sector (scouts)
- 1 operational mentor who's scaled a team before (operator)

You don't need 500 LinkedIn connections. You need 11 right relationships.

**How to build these relationships:**
Don't ask for favours upfront. Give first. Share what you're learning. Share resources. Introduce two people who should know each other.

The best opener: "I've been following your work on [specific thing]. I'm building [one line]. I had one question: [genuinely specific question]. Would a 15-minute call be possible?"

**Maintaining the network**
Check in once a quarter with updates, not always asks. Share a milestone. Share something they'd find useful. Make the relationship feel alive.

**The GSF Community advantage**
Every post you make here is indexed by GSF advisors. Every founder who reads your story and reaches out is a potential co-founder, customer, or collaborator.

Show up consistently. Share honestly. Ask specifically. Follow up always.`,
    author: "Aryan Kapoor", authorRole: "GSF Team · aryan@gsf.co",
    date: "Mar 24, 2026", readTime: "4 min", featured: false,
    gradient: "135deg, rgba(6,182,212,0.08) 0%, rgba(6,182,212,0.04) 100%",
    accentColor: "#06B6D4",
  },
  {
    id: "cm2",
    category: "Community",
    title: "How to Ask for Help Without Looking Weak or Wasting People's Time",
    excerpt: "Most founders either never ask for help, or ask in ways that guarantee no response. The exact frameworks GSF members use to get answers fast.",
    content: `Bad ask: "Hey, could you review my idea sometime?"
Good ask: "I have a 10-slide deck on [specific problem]. Could you spend 20 minutes on Zoom Tuesday between 2–4pm? I have 3 specific questions about pricing."

The difference? Specificity, time-box, and respect for the other person's attention.

**The anatomy of a high-response ask:**

1. **Context** (2 sentences): Who you are and what you're building.
2. **Why this person** (1 sentence): Why specifically you're asking them.
3. **The ask** (1 sentence): What you want, with a time boundary.
4. **The output** (1 sentence): What you'll do with their input.

Total: 4 sentences. No more.

**Ask for specific things, not general opinions:**
Bad: "Any thoughts on my business?"
Good: "Is my pricing strategy wrong? We're charging ₹299/month but 40% of trials don't convert. Here's our landing page."

**The follow-through**
After every help session, send a follow-up within 48 hours: "Based on your feedback, we [specific change]. Early results: [specific outcome]. Thank you."

This is how advisors become champions for your business.

**What not to ask:**
- "Can you review my entire business plan?" (too broad)
- "Can you introduce me to XYZ?" before you've given them value
- "What do you think of this idea?" without providing context

Help is abundant. Specific, respectful asks unlock it.`,
    author: "Meera Krishnan", authorRole: "GSF Team · meera@gsf.co",
    date: "Mar 3, 2026", readTime: "5 min", featured: false,
    gradient: "135deg, rgba(139,92,246,0.07) 0%, rgba(139,92,246,0.03) 100%",
    accentColor: "#8B5CF6",
  },
  {
    id: "cm3",
    category: "Community",
    title: "The GSF Founder Code: How We Do Things Here",
    excerpt: "What makes GSF different from every other community for student founders — and the unwritten rules that the best members follow naturally.",
    content: `GSF isn't a WhatsApp group. It isn't a Discord. It isn't a LinkedIn feed.

It's a community with a contract: show up with honesty, specificity, and genuine intent to help — and this community will return the same to you.

**The 5 principles of the GSF Community:**

**1. Specificity over inspiration**
"We just crossed ₹1L MRR!" is fine. "We crossed ₹1L MRR by switching our pricing from subscription to per-seat — here's what changed and why" is GSF.

**2. Honest failures, not just wins**
The posts that generate the most genuine response on GSF are the ones about what didn't work. Failure posts create connections. Success posts get likes.

**3. Expert is a commitment, not a title**
GSF experts are here to give the same quality of advice they'd give a paying client. If you're an expert on this platform, you have a responsibility to that standard.

**4. Respect the stage**
A founder in Ideation doesn't need Series A advice. A founder post-PMF doesn't need basic validation prompts. Know your audience within the community.

**5. Follow up**
If someone helps you, tell them what happened. Close the loop. This single habit separates the people who extract value from the people who build it.

The GSF community grows when every single member adds more than they take.

We design the platform around that bet.`,
    author: "Ravi Shankar", authorRole: "GSF Team · ravi@gsf.co",
    date: "Feb 14, 2026", readTime: "4 min", featured: false,
    gradient: "135deg, rgba(16,185,129,0.07) 0%, rgba(16,185,129,0.03) 100%",
    accentColor: "#10B981",
  },

  // ── Growth ────────────────────────────────────────────────────────────────
  {
    id: "gr1",
    category: "Growth",
    title: "Building a Waitlist That Actually Converts",
    excerpt: "Your landing page is live. Now what? A breakdown of the exact tactics GSF founders used to convert 40% of their waitlists.",
    content: `The average waitlist converts at 8–12%. The best waitlist builds at GSF convert at 35–45%.

Here's the difference.

**Why most waitlists fail:**
- Generic "coming soon" messaging
- No reason to share
- No sense of exclusivity or scarcity
- Zero follow-up cadence

**The 4-part waitlist framework:**

**1. The hook (your lander)**
One specific outcome. Not "a platform for founders" — "cut your customer discovery time by 60%." The specificity of your value prop is the primary conversion driver.

**2. The referral loop**
Use a tool like Viral Loops or a simple custom referral code. Give people a reason to share: "Refer 3 founders, skip the queue." This creates organic growth without paid spend.

**3. The nurture sequence**
Day 1: Welcome email + proof of progress (screenshot, demo video)
Day 7: Share a problem-related insight (no product pitch)
Day 14: Share a founder story from your beta
Day 21: "Spots opening soon" — create real urgency from real beta access

**4. The conversion email**
When you're ready to open: "Your spot is ready." Make the CTA single, clear, and time-sensitive. "Activate by [date] or your spot goes to the waitlist."

**What doesn't work:**
- Broad social posts without a specific CTA
- Sending generic newsletters
- Not having a follow-up sequence at all

The waitlist is your first product. Treat it that way.`,
    author: "Aryan Kapoor", authorRole: "GSF Team · aryan@gsf.co",
    date: "Mar 28, 2026", readTime: "6 min", featured: false,
    gradient: "135deg, rgba(139,92,246,0.08) 0%, rgba(139,92,246,0.04) 100%",
    accentColor: "#8B5CF6",
  },
  {
    id: "gr2",
    category: "Growth",
    title: "Content-Led Growth: How Student Founders Build Audiences Before Products",
    excerpt: "The cheapest distribution channel isn't paid ads — it's content. How GSF founders use LinkedIn, communities, and blogs to build demand before launch.",
    content: `The founders who grow fastest in GSF don't wait until launch to build an audience. They build the audience as they build the product.

**Why content works for student founders:**
- It's free
- It compounds (content from 6 months ago still drives signups)
- It attracts the exact people you want as early customers
- It builds trust faster than any ad campaign

**The founder content playbook:**

**1. Document, don't create**
Stop trying to write thought leadership. Just document: "Here's what I tried this week building [venture]. Here's what happened."

This is authentic, easier to write, and more interesting to read than polished content.

**2. The 3-2-1 framework (weekly cadence)**
- 3 short LinkedIn posts (problem observation, something I learned, something that didn't work)
- 2 community posts (GSF forum, Reddit, Discord in your sector)
- 1 longer piece (newsletter, blog post, Twitter thread)

This is sustainable. It takes 3–4 hours/week. It compounds.

**3. Consistency kills competition**
Most founders post 3 times and stop. If you post consistently for 6 months, you will have an audience. This is not an opinion — it's math.

**4. What to write about**
- The problem you're solving and why it matters
- Customer interview insights (anonymised)
- Your mistakes and pivots
- Industry research you've done
- Behind-the-scenes build updates

**The compound effect:**
Month 1: 50 followers reading your content
Month 6: 2,000 followers, 400 email subscribers
Month 12: First customers came from your content

It's not marketing. It's relationship at scale.`,
    author: "Meera Krishnan", authorRole: "GSF Team · meera@gsf.co",
    date: "Mar 15, 2026", readTime: "8 min", featured: false,
    gradient: "135deg, rgba(239,68,68,0.07) 0%, rgba(239,68,68,0.03) 100%",
    accentColor: "#EF4444",
  },
  {
    id: "gr3",
    category: "Growth",
    title: "Referral Programs That Don't Feel Gross: A Student Founder's Playbook",
    excerpt: "The best referral program in the world is a product people genuinely love. Here's how to build referral mechanics without bribing your users.",
    content: `Most referral programs fail because they're built on bribery: "Get ₹100 off for every friend you refer."

The best referral programs are built on identity: "Share this because it says something true about who you are."

**The 3 types of referral motivations:**
1. **Financial** — Discounts, credits, cash. Works for commodities. Attracts price-sensitive users. High churn after incentive ends.
2. **Social** — Status, exclusivity, identity. Works for products with social currency (apps, communities, memberships). Stickier.
3. **Altruistic** — "Help a friend." Works when the product genuinely solves a painful problem and the user wants others to experience that relief.

**For student founders, social and altruistic referrals are almost always more effective and cheaper.**

**Building a referral loop:**

Step 1: Identify your "natural shareable moment" — when does a user first feel the product is amazing? That's when you prompt the share.

Step 2: Make sharing frictionless. One button. Pre-written message. No signup required to click the link.

Step 3: Track referral source. Know which users are bringing in the most other users. Double down on attracting more like them.

**The product-led referral:**
Some products are inherently viral: Notion pages, Figma designs, Calendly links, Google Docs. Every shared output is a product ad.

Ask yourself: is there a natural shareable artefact in my product?

If not, build one.`,
    author: "Ravi Shankar", authorRole: "GSF Team · ravi@gsf.co",
    date: "Feb 20, 2026", readTime: "7 min", featured: false,
    gradient: "135deg, rgba(6,182,212,0.07) 0%, rgba(6,182,212,0.03) 100%",
    accentColor: "#06B6D4",
  },
];

const STATS = [
  { value: `${ARTICLES.length}+`, label: "Articles published",  icon: BookOpen },
  { value: "12K+",                label: "Monthly readers",     icon: Users },
  { value: "4.9★",                label: "Avg article rating",  icon: TrendingUp },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

export default function InsightsPage() {
  const { user } = useUser();
  const isGsfTeam = user?.emailAddresses?.some(e => e.emailAddress.includes("@gsf"));
  const [activeCategory, setActiveCategory] = useState("All");
  const [openArticle,    setOpenArticle]    = useState<Article | null>(null);
  const [email,          setEmail]          = useState("");
  const [subscribed,     setSubscribed]     = useState(false);

  const filtered = activeCategory === "All" ? ARTICLES : ARTICLES.filter(a => a.category === activeCategory);
  const featured = filtered.find(a => a.featured) || filtered[0];
  const rest      = filtered.filter(a => a !== featured);

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>

        {/* Hero */}
        <section className="relative section-padding bg-soft-pattern overflow-hidden">
          <div className="absolute inset-0 bg-dot-grid opacity-20 pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] pointer-events-none" style={{ background: "rgba(91,108,255,0.08)" }} />
          <div className="section-container relative z-10">
            <motion.div {...fadeUp(0)} className="text-center max-w-3xl mx-auto">
              <span className="badge badge-blue mb-6"><Zap className="size-3" /> GSF Insights</span>
              <h1 className="text-5xl sm:text-6xl tracking-tight mb-6" style={{ fontFamily: "'Playfair Display', serif", color: "var(--text-primary)" }}>
                Founder knowledge,{" "}
                <em className="not-italic text-gradient-primary">no gatekeepers.</em>
              </h1>
              <p className="text-xl leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Playbooks, frameworks, and real talk from the builders who&apos;ve been there.
                Written by the GSF team — free forever.
              </p>
            </motion.div>

            {/* GSF-only authoring notice */}
            <motion.div {...fadeUp(0.1)} className="flex items-center justify-center mt-8">
              <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl"
                style={{ backgroundColor: "rgba(91,108,255,0.07)", border: "1px solid rgba(91,108,255,0.18)" }}>
                <Shield className="size-4 shrink-0" style={{ color: "var(--accent-indigo)" }} />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  <strong style={{ color: "var(--text-primary)" }}>GSF Team only</strong> — Articles are authored exclusively by verified GSF staff
                  <span className="ml-1 font-mono text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(91,108,255,0.1)", color: "var(--accent-indigo)" }}>@gsf.co</span>
                </span>
                <Lock className="size-3.5 shrink-0" style={{ color: "var(--text-muted)" }} />
              </div>
            </motion.div>

            {isGsfTeam && (
              <motion.div {...fadeUp(0.12)} className="flex justify-center mt-6">
                <button className="btn-primary text-sm py-2 px-5 flex items-center gap-2" onClick={() => alert("Post Article feature coming soon!")}>
                  <Plus className="size-4" /> Post Article
                </button>
              </motion.div>
            )}

            {/* Stats */}
            <motion.div {...fadeUp(0.15)} className="flex flex-wrap items-center justify-center gap-8 mt-10">
              {STATS.map(({ value, label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="size-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(91,108,255,0.1)" }}>
                    <Icon className="size-5" style={{ color: "var(--accent-indigo)" }} />
                  </div>
                  <div>
                    <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{value}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Category filter */}
        <section className="border-b sticky top-16 z-30 backdrop-blur-md" style={{ backgroundColor: "var(--bg-nav)", borderBottomColor: "var(--border-default)" }}>
          <div className="section-container">
            <div className="flex gap-1 py-2 overflow-x-auto">
              {CATEGORIES.map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className="px-4 py-2 rounded-lg text-sm font-medium flex-shrink-0 transition-all"
                  style={{
                    backgroundColor: activeCategory === cat ? "rgba(91,108,255,0.1)" : "transparent",
                    color: activeCategory === cat ? "var(--accent-indigo)" : "var(--text-secondary)",
                    border: activeCategory === cat ? "1px solid rgba(91,108,255,0.2)" : "1px solid transparent",
                  }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Articles */}
        <section className="section-container section-padding">
          {/* Featured */}
          {featured && (
            <motion.div {...fadeUp(0)} className="mb-12">
              <div className="card p-8 lg:p-12 card-hover relative overflow-hidden cursor-pointer"
                style={{ background: `linear-gradient(${featured.gradient})` }}
                onClick={() => setOpenArticle(featured)}>
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="badge text-xs" style={{ backgroundColor: `${featured.accentColor}18`, color: featured.accentColor, border: `1px solid ${featured.accentColor}30` }}>{featured.category}</span>
                      <span className="badge badge-warm text-[10px]">★ Featured</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "var(--text-primary)" }}>{featured.title}</h2>
                    <p className="text-base leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>{featured.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                      <span className="flex items-center gap-1"><Users className="size-3.5" />{featured.author}</span>
                      <span className="flex items-center gap-1"><Calendar className="size-3.5" />{featured.date}</span>
                      <span className="flex items-center gap-1"><Clock className="size-3.5" />{featured.readTime}</span>
                    </div>
                    <button onClick={() => setOpenArticle(featured)} className="btn-primary px-6 py-2.5">
                      Read article <ArrowRight className="size-4" />
                    </button>
                  </div>
                  <div className="hidden lg:flex items-center justify-center">
                    <div className="size-48 rounded-full flex items-center justify-center"
                      style={{ background: `${featured.accentColor}14`, border: `2px solid ${featured.accentColor}25` }}>
                      <BookOpen className="size-16 opacity-60" style={{ color: featured.accentColor }} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Article grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((article, i) => (
              <motion.div key={article.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.4 }}>
                <div className="card p-6 card-hover h-full flex flex-col cursor-pointer"
                  style={{ background: `linear-gradient(${article.gradient})` }}
                  onClick={() => setOpenArticle(article)}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="badge text-[10px]" style={{ backgroundColor: `${article.accentColor}15`, color: article.accentColor, border: `1px solid ${article.accentColor}25` }}>
                      {article.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-3 leading-snug" style={{ color: "var(--text-primary)", fontFamily: "'Playfair Display', serif" }}>{article.title}</h3>
                  <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: "var(--text-secondary)" }}>{article.excerpt}</p>
                  <div className="flex items-center justify-between pt-4 border-t" style={{ borderTopColor: "var(--border-soft)" }}>
                    <div>
                      <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{article.author}</p>
                      <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{article.date} · {article.readTime}</p>
                    </div>
                    <button className="flex items-center gap-1 text-xs font-medium" style={{ color: article.accentColor }}>
                      Read <ChevronRight className="size-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Newsletter CTA — FIXED contrast */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="mt-16 p-10 rounded-3xl text-center relative overflow-hidden"
            style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-default)" }}
          >
            <div className="relative z-10">
              <div className="size-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "rgba(91,108,255,0.1)", border: "1px solid rgba(91,108,255,0.2)" }}>
                <Mail className="size-6" style={{ color: "var(--accent-indigo)" }} />
              </div>
              <h2 className="text-3xl mb-3" style={{ fontFamily: "'Playfair Display', serif", color: "var(--text-primary)" }}>
                The Founder Brief
              </h2>
              <p className="mb-6 max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
                One email, every Friday. The best GSF insights, curated for serious founders.
              </p>
              {subscribed ? (
                <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl"
                  style={{ backgroundColor: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
                  <span className="text-sm font-semibold text-emerald-500">You&apos;re in! First issue lands this Friday.</span>
                </div>
              ) : (
                <div className="flex gap-3 max-w-md mx-auto">
                  <input type="email" placeholder="you@startup.com" id="newsletter-email"
                    className="flex-1 px-4 py-3 rounded-xl text-sm"
                    style={{ backgroundColor: "var(--bg-surface-2)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                    value={email} onChange={e => setEmail(e.target.value)} />
                  <button className="btn-primary px-5 py-2.5 text-sm flex-shrink-0"
                    onClick={() => email.includes("@") && setSubscribed(true)}>
                    Subscribe
                  </button>
                </div>
              )}
              <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>No spam. Unsubscribe anytime.</p>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />

      {/* Article reader modal */}
      <AnimatePresence>
        {openArticle && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
            style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            onClick={e => e.target === e.currentTarget && setOpenArticle(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 32 }}
              transition={{ duration: 0.3 }}
              className="card max-w-2xl w-full my-8 overflow-hidden"
              style={{ backgroundColor: "var(--bg-canvas)" }}
            >
              {/* Modal header */}
              <div className="p-6 border-b" style={{ borderBottomColor: "var(--border-default)", background: `linear-gradient(${openArticle.gradient})` }}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="badge text-xs mb-3 inline-block"
                      style={{ backgroundColor: `${openArticle.accentColor}18`, color: openArticle.accentColor, border: `1px solid ${openArticle.accentColor}30` }}>
                      {openArticle.category}
                    </span>
                    <h2 className="text-2xl font-bold leading-snug" style={{ fontFamily: "'Playfair Display', serif", color: "var(--text-primary)" }}>
                      {openArticle.title}
                    </h2>
                  </div>
                  <button onClick={() => setOpenArticle(null)} className="size-9 rounded-lg flex items-center justify-center shrink-0 transition-colors hover:bg-black/10"
                    style={{ color: "var(--text-muted)" }}>
                    <X className="size-5" />
                  </button>
                </div>
                <div className="flex items-center gap-4 mt-4 text-xs" style={{ color: "var(--text-muted)" }}>
                  <span className="flex items-center gap-1"><Users className="size-3.5" />{openArticle.author}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-mono" style={{ backgroundColor: "rgba(91,108,255,0.1)", color: "var(--accent-indigo)" }}>
                    {openArticle.authorRole}
                  </span>
                  <span className="flex items-center gap-1"><Calendar className="size-3.5" />{openArticle.date}</span>
                  <span className="flex items-center gap-1"><Clock className="size-3.5" />{openArticle.readTime}</span>
                </div>
              </div>

              {/* Article body */}
              <div className="p-6 prose max-w-none" style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
                {openArticle.content.split("\n\n").map((para, i) => {
                  if (para.startsWith("**") && para.endsWith("**") && para.split("**").length === 3) {
                    return <h3 key={i} className="text-lg font-bold mt-6 mb-2" style={{ color: "var(--text-primary)", fontFamily: "'Playfair Display', serif" }}>{para.slice(2, -2)}</h3>;
                  }
                  // Bold inline segments
                  const parts = para.split(/(\*\*[^*]+\*\*)/g);
                  return (
                    <p key={i} className="mb-4 text-sm leading-relaxed">
                      {parts.map((part, j) =>
                        part.startsWith("**") && part.endsWith("**")
                          ? <strong key={j} style={{ color: "var(--text-primary)" }}>{part.slice(2, -2)}</strong>
                          : part
                      )}
                    </p>
                  );
                })}
              </div>

              {/* Modal footer */}
              <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderTopColor: "var(--border-default)" }}>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>Published by GSF Team · {openArticle.authorRole}</span>
                <button onClick={() => setOpenArticle(null)} className="btn-outline text-sm py-2 px-4">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
