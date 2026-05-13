"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import React from "react";
import {
  ArrowUp, ArrowDown, MessageSquare, Share2, Bookmark, BookmarkCheck,
  PenSquare, TrendingUp, Clock, Flame, Search, Lightbulb, BarChart2,
  Rocket, DollarSign, Building2, Pin, Briefcase, Star, Users,
  X, Send, CheckCircle2, Link2
} from "lucide-react";
import { cn } from "@/lib/utils";

const AVATAR_COLORS = [
  { bg: "#DBEAFE", text: "#1E40AF" },
  { bg: "#FCE7F3", text: "#9D174D" },
  { bg: "#D1FAE5", text: "#065F46" },
  { bg: "#FEF3C7", text: "#92400E" },
  { bg: "#EDE9FE", text: "#5B21B6" },
  { bg: "#FFE4E6", text: "#9F1239" },
  { bg: "#CFFAFE", text: "#155E75" },
  { bg: "#F0FDF4", text: "#14532D" },
];

type Comment = { id: string; author: string; initials: string; avatarColor: { bg: string; text: string }; text: string; time: string };
type Post = {
  id: string; author: string; initials: string; avatarColor: { bg: string; text: string };
  role: string; roleType: "founder" | "expert" | "investor"; time: string; tag: string;
  title: string; body: string; upvotes: number; comments: Comment[]; stage?: string;
  pinned?: boolean; userVote?: 1 | -1 | null; saved?: boolean;
};

const STAGE_STYLES: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  "Ideation":             { bg: "#FEF3C7", text: "#92400E", icon: Lightbulb },
  "Idea Screening":       { bg: "#EDE9FE", text: "#5B21B6", icon: Search },
  "Market Research":      { bg: "#DBEAFE", text: "#1E40AF", icon: BarChart2 },
  "MVP":                  { bg: "#D1FAE5", text: "#065F46", icon: Rocket },
  "Investment & Funding": { bg: "#FEF9C3", text: "#713F12", icon: DollarSign },
  "Company Launch":       { bg: "#EEF4F9", text: "#1E3A5F", icon: Building2 },
  "Product-Market Fit":   { bg: "#F0FDF4", text: "#14532D", icon: TrendingUp },
};

const ROLE_STYLES: Record<string, string> = {
  founder:  "bg-[#EEF4F9] text-[#3D74A0] border-[#AACDDC]",
  expert:   "bg-[#F3E3D0] text-[#5B4A3A] border-[#D2C4B4]",
  investor: "bg-[#D1FAE5] text-[#065F46] border-[#6EE7B7]",
};

const SEED_COMMENTS: Record<string, Comment[]> = {
  p1: [
    { id: "c1a", author: "Riya M.", initials: "RM", avatarColor: AVATAR_COLORS[2], text: "This is incredibly relatable. The 'mood tracker no one used' hit close to home. Thank you for sharing.", time: "2h ago" },
    { id: "c1b", author: "Arjun K.", initials: "AK", avatarColor: AVATAR_COLORS[4], text: "How did you structure those 15-minute calls? Any specific questions that consistently unlocked insights?", time: "1h ago" },
  ],
  p2: [
    { id: "c2a", author: "Neha J.", initials: "NJ", avatarColor: AVATAR_COLORS[0], text: "Point 1 is underrated. Most student founders describe a solution, not a problem, when pitching.", time: "5h ago" },
    { id: "c2b", author: "Dev B.", initials: "DB", avatarColor: AVATAR_COLORS[3], text: "The 90-second filter is real. I got cut off at exactly that point in my last pitch. This explains a lot.", time: "3h ago" },
    { id: "c2c", author: "Priya S.", initials: "PS", avatarColor: AVATAR_COLORS[1], text: "Incredible perspective. Saving this one for my next pitch prep session.", time: "1h ago" },
  ],
  p4: [
    { id: "c4a", author: "Aanya S.", initials: "AS", avatarColor: AVATAR_COLORS[5], text: "\"The customer asking for 10 features is usually the customer who won't renew.\" This should be printed on every founder's wall.", time: "18h ago" },
  ],
  p8: [
    { id: "c8a", author: "Rohan P.", initials: "RP", avatarColor: AVATAR_COLORS[6], text: "Speed of learning — this is the best founder filter I've ever heard. Applies to EVERYTHING.", time: "3d ago" },
    { id: "c8b", author: "Meera T.", initials: "MT", avatarColor: AVATAR_COLORS[7], text: "Do you factor academic credentials at all or purely these 3 traits?", time: "2d ago" },
  ],
};

const INITIAL_POSTS: Post[] = [
  {
    id: "p1", author: "Priya Sharma", initials: "PS", avatarColor: AVATAR_COLORS[0],
    role: "Founder · EduLoop", roleType: "founder", time: "3h ago",
    tag: "Founder Story", title: "From a WhatsApp group to ₹15L raise — my 14-month journey building EduLoop",
    body: "It started as a WhatsApp study group I ran for my college batch. By month 3, we had 200 students from 6 colleges paying ₹99/month for curated study schedules. I had no co-founder, no funding, no idea what I was doing. Here's what I learned...\n\nThe biggest mistake I made early on was building features nobody asked for. I spent 3 weeks building a \"mood tracker\" that exactly 4 people ever used. The pivot? Talk to your users every single week. Not surveys. Actual 15-minute calls. That changed everything.",
    upvotes: 284, comments: SEED_COMMENTS["p1"], stage: "Investment & Funding", pinned: false, userVote: null, saved: false,
  },
  {
    id: "p2", author: "Dr. Anika Patel", initials: "AP", avatarColor: AVATAR_COLORS[1],
    role: "Partner, Sequoia Capital India", roleType: "expert", time: "6h ago",
    tag: "Expert View", title: "What I look for in a GSF student pitch — and what kills deals immediately",
    body: "In the last 4 years I've reviewed 800+ pitches from student founders. Here's my honest filter in the first 90 seconds:\n\n1. Do they understand the problem better than anyone in the room?\n2. Are they building something they'd use themselves?\n3. Can they tell me what 'success' looks like 18 months from now?\n\nWhat kills deals: Vague TAM numbers pulled from Google (\"The edtech market is $300 billion!\"), no evidence of actual customer conversations, and co-founder dynamics that feel forced. Start with the problem. The rest follows.",
    upvotes: 412, comments: SEED_COMMENTS["p2"], pinned: true, userVote: null, saved: false,
  },
  {
    id: "p3", author: "Marcus Chen", initials: "MC", avatarColor: AVATAR_COLORS[2],
    role: "Founder · Supplify", roleType: "founder", time: "1d ago",
    tag: "Lesson Learned", title: "We almost shut down at month 8. Here's what saved us.",
    body: "We had ₹1.2L left in the bank, 0 paying customers, and 3 of our 5 pilot users had stopped logging in. I was ready to shut down Supplify.\n\nI booked a call with James Whitfield through GSF Connect on a Friday night. He spent 45 minutes going through our UX flow with me and said: 'You're solving the wrong problem. Your users don't want automation — they want confidence.' That one sentence rewrote our entire product.\n\nWe pivoted to inventory alerts instead of full automation. 14 days later we had our first paying customer. We now have ₹2L MRR.",
    upvotes: 198, comments: SEED_COMMENTS["p3"] ?? [], stage: "Product-Market Fit", userVote: null, saved: false,
  },
  {
    id: "p4", author: "James Whitfield", initials: "JW", avatarColor: AVATAR_COLORS[3],
    role: "SaaS Founder (2x exit) · GSF Expert", roleType: "expert", time: "1d ago",
    tag: "Playbook", title: "The B2B SaaS playbook I wish I had at 22 — pricing, sales, and retention",
    body: "I sold my first SaaS at 28 for $4M. My second at 33 for $22M. The same 3 mistakes killed my growth both times before I figured them out.\n\n**Pricing too low** — If nobody pushes back on your price, it's too cheap. Cheap signals low value in B2B, not affordability.\n\n**Feature creep from 1 loud customer** — The customer asking for 10 features is usually the customer who won't renew.\n\n**No quarterly business reviews** — Most churn is invisible until it's too late. QBRs make it visible at month 3.",
    upvotes: 367, comments: SEED_COMMENTS["p4"], userVote: null, saved: false,
  },
  {
    id: "p5", author: "Aisha Okafor", initials: "AO", avatarColor: AVATAR_COLORS[4],
    role: "Founder · HealthBridge", roleType: "founder", time: "2d ago",
    tag: "Behind the Build", title: "Building a telemedicine app for rural India — 6 months of reality checks",
    body: "Nobody tells you how hard distribution is when your customers don't have smartphones. We spent month 1-2 building a beautiful app. Month 3: we discovered 70% of our target users share a single phone in a household.\n\nPivot: USSD + WhatsApp integration. No app needed. Appointment booking in 4 button presses. That's when our pilots went from 12 consultations/week to 80+.\n\nTech is only ~20% of the problem in rural India. Trust-building, vernacular content, and community health workers are the other 80%.",
    upvotes: 156, comments: SEED_COMMENTS["p5"] ?? [], stage: "MVP", userVote: null, saved: false,
  },
  {
    id: "p6", author: "Yuki Tanaka", initials: "YT", avatarColor: AVATAR_COLORS[5],
    role: "Product @ Notion (prev) · GSF Expert", roleType: "expert", time: "2d ago",
    tag: "Expert View", title: "Product-led growth for student founders: what works without a sales team or marketing budget",
    body: "PLG is often misunderstood as 'just make a free tier'. It's not. PLG means your product is the primary driver of acquisition, activation, and retention.\n\nFor founders with zero budget, here's the PLG checklist I give every GSF student I mentor:\n\n✓ Can a user get real value in under 5 minutes?\n✓ Is the 'aha moment' self-serve or does it require you?\n✓ What does the user naturally want to share/invite others to see?\n\nIf you can't answer all three, build product, not campaigns.",
    upvotes: 289, comments: SEED_COMMENTS["p6"] ?? [], userVote: null, saved: false,
  },
  {
    id: "p7", author: "Rohan Verma", initials: "RV", avatarColor: AVATAR_COLORS[6],
    role: "Founder · FarmIQ", roleType: "founder", time: "3d ago",
    tag: "Ask the Community", title: "How do I explain IoT + AI to a farmer who doesn't trust technology? Real advice please.",
    body: "I've been building FarmIQ for 5 months. The tech works great in lab. But when I go to actual farms, the conversation dies the moment I mention 'sensor' or 'app'.\n\nHas anyone successfully navigated this trust gap? Especially in rural India where past tech products (like eSoils, Farmguide) burned farmers. How do you build credibility fast when you're a 22-year-old CS student telling a 55-year-old farmer his yield will increase?",
    upvotes: 89, comments: SEED_COMMENTS["p7"] ?? [], stage: "Ideation", userVote: null, saved: false,
  },
  {
    id: "p8", author: "Fatima Ali", initials: "FA", avatarColor: AVATAR_COLORS[7],
    role: "VC Analyst, Blume Ventures · GSF Expert", roleType: "investor", time: "4d ago",
    tag: "Investor Lens", title: "How we evaluate pre-seed rounds from student founders — our internal rubric",
    body: "At Blume we invest at pre-seed and seed. In the last 12 months, 6 of our 18 portfolio companies were founded by sub-25 founders — half of them students.\n\nWhat we look for is different from later stage VCs. We're not analysing growth curves. We're analysing **founder character**:\n\n- Speed of learning (how fast did they update their thinking post last conversation?)\n- Resourcefulness (what have they built with almost nothing?)\n- Clarity of thought under ambiguity\n\nWe'll take a raw founder with those 3 traits over a polished deck any day.",
    upvotes: 441, comments: SEED_COMMENTS["p8"], userVote: null, saved: false,
  },
];

const TAGS = ["All", "Founder Story", "Expert View", "Playbook", "Lesson Learned", "Behind the Build", "Ask the Community", "Investor Lens"];
const SORT_OPTIONS = [{ id: "hot", label: "Hot", icon: Flame }, { id: "new", label: "New", icon: Clock }, { id: "top", label: "Top", icon: TrendingUp }];

// ── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo() { return "just now"; }
const LS_KEY = "gsf_community_posts";

function loadPosts(): Post[] {
  if (typeof window === "undefined") return INITIAL_POSTS;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return INITIAL_POSTS;
    const saved: Post[] = JSON.parse(raw);
    // Merge: preserve seed posts, prepend user posts
    const ids = new Set(INITIAL_POSTS.map(p => p.id));
    const userPosts = saved.filter(p => !ids.has(p.id));
    return [...userPosts, ...INITIAL_POSTS];
  } catch { return INITIAL_POSTS; }
}

function savePosts(posts: Post[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(posts));
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function CommunityPage() {
  const [posts,      setPosts]      = useState<Post[]>(INITIAL_POSTS);
  const [activeTag,  setActiveTag]  = useState("All");
  const [sort,       setSort]       = useState("hot");
  const [search,     setSearch]     = useState("");
  const [expanded,   setExpanded]   = useState<string | null>(null);
  const [commentMap, setCommentMap] = useState<Record<string, string>>({});
  const [showCreate, setShowCreate] = useState(false);
  const [toast,      setToast]      = useState<string | null>(null);
  const [newPost,    setNewPost]    = useState({ title: "", body: "", tag: "Founder Story" });

  // Load from localStorage on mount
  useEffect(() => { setPosts(loadPosts()); }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleVote(postId: string, dir: 1 | -1) {
    setPosts(prev => {
      const next = prev.map(p => {
        if (p.id !== postId) return p;
        const pv = p.userVote;
        if (pv === dir) return { ...p, userVote: null, upvotes: p.upvotes - dir };
        const delta = pv ? dir * 2 : dir;
        return { ...p, userVote: dir, upvotes: p.upvotes + delta };
      });
      savePosts(next);
      return next;
    });
  }

  function handleSave(postId: string) {
    setPosts(prev => {
      const next = prev.map(p => p.id === postId ? { ...p, saved: !p.saved } : p);
      savePosts(next);
      const post = next.find(p => p.id === postId);
      showToast(post?.saved ? "Post saved to your library" : "Post removed from library");
      return next;
    });
  }

  async function handleShare(post: Post) {
    const url = `${window.location.origin}/community#${post.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, text: post.body.slice(0, 100), url });
        showToast("Shared successfully!");
      } catch { /* user cancelled */ }
    } else {
      navigator.clipboard.writeText(url);
      showToast("Link copied to clipboard!");
    }
  }

  function submitComment(postId: string) {
    const text = (commentMap[postId] || "").trim();
    if (!text) return;
    const comment: Comment = {
      id: `c_${Date.now()}`, author: "You", initials: "YO",
      avatarColor: AVATAR_COLORS[4], text, time: timeAgo(),
    };
    setPosts(prev => {
      const next = prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, comment] } : p);
      savePosts(next);
      return next;
    });
    setCommentMap(m => ({ ...m, [postId]: "" }));
    showToast("Comment posted!");
  }

  function submitPost() {
    if (!newPost.title.trim() || !newPost.body.trim()) return;
    const post: Post = {
      id: `up_${Date.now()}`,
      author: "You",
      initials: "YO",
      avatarColor: AVATAR_COLORS[4],
      role: "GSF Member",
      roleType: "founder",
      time: "just now",
      tag: newPost.tag,
      title: newPost.title.trim(),
      body: newPost.body.trim(),
      upvotes: 0,
      comments: [],
      userVote: null,
      saved: false,
    };
    setPosts(prev => {
      const next = [post, ...prev];
      savePosts(next);
      return next;
    });
    setNewPost({ title: "", body: "", tag: "Founder Story" });
    setShowCreate(false);
    showToast("Post published to GSF Community!");
  }

  const filtered = posts
    .filter(p => activeTag === "All" || p.tag === activeTag)
    .filter(p => search === "" || p.title.toLowerCase().includes(search.toLowerCase()) || p.author.toLowerCase().includes(search.toLowerCase()) || p.body.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      if (sort === "top") return b.upvotes - a.upvotes;
      if (sort === "new") return a.time.localeCompare(b.time);
      return (b.upvotes + b.comments.length * 2) - (a.upvotes + a.comments.length * 2);
    });

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen bg-canvas">

        {/* Header */}
        <section className="bg-surface border-b border-border transition-colors">
          <div className="section-container py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl text-text-primary mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>GSF Community</h1>
                <p className="text-text-secondary text-sm">Where founders share their journey and experts share their playbooks.</p>
              </div>
              <button onClick={() => setShowCreate(true)} className="btn-primary shrink-0">
                <PenSquare className="size-4" /> Create a post
              </button>
            </div>
          </div>
        </section>

        <div className="section-container py-8 flex flex-col lg:flex-row gap-6">

          {/* Main feed */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* Search + sort */}
            <div className="bg-surface rounded-2xl border border-border p-4 flex flex-col sm:flex-row gap-3 shadow-sm transition-colors">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
                <input type="text" placeholder="Search posts, authors, topics..." className="input pl-10 h-9 text-sm bg-surface border-border" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="flex gap-1.5">
                {SORT_OPTIONS.map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => setSort(id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${sort === id ? "bg-primary-500 text-white border-primary-500" : "bg-surface text-text-secondary border-border hover:border-primary-400"}`}>
                    <Icon className="size-3.5" />{label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tag filter */}
            <div className="flex gap-2 flex-wrap">
              {TAGS.map(tag => (
                <button key={tag} onClick={() => setActiveTag(tag)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${activeTag === tag ? "bg-text-primary text-text-inverse border-text-primary" : "bg-surface text-text-secondary border-border hover:border-primary-400"}`}>
                  {tag}
                </button>
              ))}
            </div>

            {/* Posts */}
            {filtered.map((post) => {
              const stageStyle = post.stage ? STAGE_STYLES[post.stage] : null;
              const isExpanded = expanded === post.id;
              return (
                <div key={post.id} id={post.id} className={cn("bg-surface rounded-2xl border overflow-hidden transition-all group", post.pinned ? "border-primary-200/50 dark:border-primary-500/30 shadow-sm" : "border-border hover:border-primary-400 hover:shadow-soft")}>
                  {post.pinned && (
                    <div className="bg-surface-2 border-b border-border px-4 py-2 text-xs font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1.5">
                      <Pin className="size-3" /> Pinned post
                    </div>
                  )}
                  <div className="flex">
                    {/* Vote column */}
                    <div className="flex flex-col items-center gap-1 px-3 pt-4 pb-4 bg-background border-r border-border min-w-[52px] transition-colors">
                      <button onClick={() => handleVote(post.id, 1)}
                        className={cn("size-7 rounded-md flex items-center justify-center transition-colors hover:bg-surface-2", post.userVote === 1 ? "text-primary-500" : "text-text-muted")}>
                        <ArrowUp className="size-4" />
                      </button>
                      <span className={cn("text-xs font-bold transition-colors", post.userVote === 1 ? "text-primary-500" : post.userVote === -1 ? "text-red-500" : "text-text-primary")}>{post.upvotes}</span>
                      <button onClick={() => handleVote(post.id, -1)}
                        className={cn("size-7 rounded-md flex items-center justify-center transition-colors hover:bg-red-500/10", post.userVote === -1 ? "text-red-500" : "text-text-muted")}>
                        <ArrowDown className="size-4" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5">
                      {/* Author row */}
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="size-8 rounded-full border border-border flex items-center justify-center text-xs font-bold shrink-0 shadow-sm"
                          style={{ background: post.avatarColor.bg, color: post.avatarColor.text }}>{post.initials}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-text-primary">{post.author}</span>
                            <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1", ROLE_STYLES[post.roleType])}>
                              {post.roleType === "founder" ? <Briefcase className="size-2.5" /> : post.roleType === "expert" ? <Star className="size-2.5" /> : <Users className="size-2.5" />} {post.role}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-text-muted mt-0.5">
                            <span>{post.time}</span>
                            {stageStyle && (
                              <>
                                <span>·</span>
                                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1"
                                  style={{ background: stageStyle.bg, color: stageStyle.text }}>
                                  <stageStyle.icon className="size-2.5" /> {post.stage}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <span className="badge badge-warm text-[10px] shrink-0">{post.tag}</span>
                      </div>

                      <h2 className="text-base font-bold text-text-primary leading-snug mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
                        style={{ fontFamily: "'Playfair Display', serif" }}>{post.title}</h2>
                      <p className="text-sm text-text-secondary leading-relaxed line-clamp-3 whitespace-pre-line">{post.body.split("\n")[0]}</p>

                      {/* Actions */}
                      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border">
                        <button onClick={() => setExpanded(isExpanded ? null : post.id)}
                          className={cn("flex items-center gap-1.5 text-xs transition-colors", isExpanded ? "text-primary-500" : "text-text-muted hover:text-primary-500")}>
                          <MessageSquare className="size-3.5" /> {post.comments.length} comment{post.comments.length !== 1 ? "s" : ""}
                        </button>
                        <button onClick={() => handleShare(post)} className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary-500 transition-colors">
                          <Share2 className="size-3.5" /> Share
                        </button>
                        <button onClick={() => handleSave(post.id)} className={cn("flex items-center gap-1.5 text-xs transition-colors", post.saved ? "text-amber-500" : "text-text-muted hover:text-primary-500")}>
                          {post.saved ? <BookmarkCheck className="size-3.5" /> : <Bookmark className="size-3.5" />}
                          {post.saved ? "Saved" : "Save"}
                        </button>
                      </div>

                      {/* Expandable comment section */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-border space-y-3">
                          {post.comments.length > 0 ? (
                            post.comments.map(c => (
                              <div key={c.id} className="flex gap-2.5">
                                <div className="size-7 rounded-full border border-border flex items-center justify-center text-[10px] font-bold shrink-0"
                                  style={{ background: c.avatarColor.bg, color: c.avatarColor.text }}>{c.initials}</div>
                                <div className="flex-1 bg-surface-2 rounded-xl px-3 py-2 transition-colors">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-xs font-semibold text-text-primary">{c.author}</span>
                                    <span className="text-[10px] text-text-muted">{c.time}</span>
                                  </div>
                                  <p className="text-xs text-text-secondary leading-relaxed">{c.text}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-text-muted italic">No comments yet. Be the first to reply.</p>
                          )}

                          {/* Add comment */}
                          <div className="flex gap-2 pt-1">
                            <div className="size-7 rounded-full bg-surface-2 border border-border flex items-center justify-center text-[10px] font-bold text-primary-600 dark:text-primary-400 shrink-0 shadow-sm">YO</div>
                            <div className="flex-1 flex gap-2">
                              <input
                                type="text"
                                placeholder="Write a comment..."
                                className="input text-xs py-1.5 flex-1 bg-surface border-border focus:ring-1 focus:ring-primary-500/30"
                                value={commentMap[post.id] || ""}
                                onChange={e => setCommentMap(m => ({ ...m, [post.id]: e.target.value }))}
                                onKeyDown={e => e.key === "Enter" && submitComment(post.id)}
                              />
                              <button onClick={() => submitComment(post.id)}
                                className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1">
                                <Send className="size-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="bg-surface rounded-2xl border border-border p-16 text-center transition-colors">
                <MessageSquare className="size-10 text-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">No posts found</h3>
                <p className="text-sm text-text-muted">Try a different tag or search term.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-72 space-y-5 shrink-0">

            {/* Welcome to GSF Community */}
            <div className="rounded-2xl border border-border overflow-hidden transition-all shadow-sm">
              {/* Blue banner */}
              <div className="px-5 py-4 text-center" style={{ background: "linear-gradient(135deg, var(--color-primary-600), var(--color-accent-400))" }}>
                <p className="text-white font-bold text-sm tracking-wide">Welcome to GSF Community</p>
                <p className="text-white/80 text-[11px] mt-0.5">Join 2,400+ founders & experts</p>
              </div>
              <div className="bg-surface p-5 transition-colors">
                <p className="text-xs text-text-secondary leading-relaxed mb-4">
                  The space where student founders share their journey — from first idea to funded company — and where experts share honest playbooks.
                </p>
                <button onClick={() => setShowCreate(true)} className="btn-primary w-full justify-center text-sm py-2.5">
                  <PenSquare className="size-3.5" /> Create a post
                </button>
              </div>
            </div>

            {/* Community rules */}
            <div className="bg-surface rounded-2xl border border-border p-5 transition-colors">
              <h3 className="font-semibold text-text-primary mb-3 text-sm">Community Guidelines</h3>
              <ol className="space-y-2.5 text-xs text-text-secondary">
                {[
                  "Be specific — vague posts get ignored",
                  "Share what actually happened, not the highlight reel",
                  "Experts: give the advice you'd give a friend",
                  "Founders: be honest about your stage and challenges",
                  "No self-promotion without genuine value",
                  "Constructive feedback > cheerleading",
                ].map((rule, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="size-4 rounded-full bg-surface-2 text-primary-500 text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    {rule}
                  </li>
                ))}
              </ol>
            </div>

            {/* Saved count */}
            <div className="bg-surface rounded-2xl border border-border p-5 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-text-primary text-sm">Saved Posts</h3>
                  <p className="text-xs text-text-muted">{posts.filter(p => p.saved).length} post{posts.filter(p => p.saved).length !== 1 ? "s" : ""} saved</p>
                </div>
                <BookmarkCheck className="size-5 text-amber-500" />
              </div>
              {posts.filter(p => p.saved).length > 0 && (
                <div className="mt-3 space-y-2">
                  {posts.filter(p => p.saved).slice(0, 3).map(p => (
                    <div key={p.id} className="text-xs text-text-secondary bg-background rounded-lg px-3 py-2 line-clamp-1">{p.title}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Top contributors */}
            <div className="bg-surface rounded-2xl border border-border p-5 transition-colors">
              <h3 className="font-semibold text-text-primary mb-4 text-sm">Top Contributors</h3>
              <div className="space-y-3">
                {[
                  { name: "Dr. Anika Patel",  role: "VC Partner",        initials: "AP", av: AVATAR_COLORS[1], posts: 24 },
                  { name: "Fatima Ali",        role: "VC Analyst",        initials: "FA", av: AVATAR_COLORS[7], posts: 19 },
                  { name: "James Whitfield",   role: "SaaS Founder",      initials: "JW", av: AVATAR_COLORS[3], posts: 17 },
                  { name: "Priya Sharma",      role: "Founder, EduLoop",  initials: "PS", av: AVATAR_COLORS[0], posts: 12 },
                  { name: "Yuki Tanaka",       role: "Ex-Notion PM",      initials: "YT", av: AVATAR_COLORS[5], posts: 11 },
                ].map(c => (
                  <div key={c.name} className="flex items-center gap-2.5">
                    <div className="size-8 rounded-full border border-border flex items-center justify-center text-xs font-bold shrink-0 shadow-sm"
                      style={{ background: c.av.bg, color: c.av.text }}>{c.initials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-text-primary truncate">{c.name}</div>
                      <div className="text-[10px] text-text-muted">{c.role}</div>
                    </div>
                    <span className="text-[10px] text-text-muted">{c.posts} posts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Create Post Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          onClick={e => e.target === e.currentTarget && setShowCreate(false)}>
          <div className="bg-surface rounded-2xl border border-border shadow-xl w-full max-w-lg p-6 transition-colors">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-text-primary text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Create a Post</h2>
              <button onClick={() => setShowCreate(false)} className="size-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-surface-2 transition-colors">
                <X className="size-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-1.5">Category</label>
                <select className="input text-sm bg-surface border-border" value={newPost.tag} onChange={e => setNewPost(p => ({ ...p, tag: e.target.value }))}>
                  {TAGS.slice(1).map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-1.5">Title *</label>
                <input className="input bg-surface border-border" placeholder="What did you build, learn, or want to ask?" value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-1.5">Your story *</label>
                <textarea className="input min-h-[140px] resize-none text-sm bg-surface border-border" placeholder="Share the full context — what happened, what you learned, and what advice you have or need." value={newPost.body} onChange={e => setNewPost(p => ({ ...p, body: e.target.value }))} />
              </div>
              <button onClick={submitPost} disabled={!newPost.title.trim() || !newPost.body.trim()}
                className="btn-primary w-full justify-center py-3"
                style={{ opacity: (!newPost.title.trim() || !newPost.body.trim()) ? 0.5 : 1 }}>
                <CheckCircle2 className="size-4" /> Publish to Community
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-lg"
          style={{ backgroundColor: "#1A2332", color: "white" }}>
          <Link2 className="size-4 shrink-0" />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}
    </>
  );
}
