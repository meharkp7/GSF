"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BookOpen, Plus, X, Send, Loader } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

type Article = {
  id: string;
  title: string;
  category: string;
  body: string;
  authorName: string;
  status: "draft" | "published";
  createdAt: string;
  publishedAt?: string;
  authorClerkId: string;
};

const CATEGORIES = ["Founder Strategy", "Fundraising", "Product", "Community", "Growth", "Legal"];

export default function InsightsPage() {
  const { user } = useUser();
  const isStaff = user?.publicMetadata?.role === "expert" || user?.publicMetadata?.role === "admin";

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: CATEGORIES[0],
    body: "",
    status: "draft" as "draft" | "published",
  });

  // Fetch published articles
  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("/api/articles?status=published");
        if (res.ok) {
          const data = await res.json();
          setArticles(data);
        }
      } catch {
        toast.error("Failed to load articles");
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  // Handle form submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.body.trim()) {
      toast.error("Article body is required");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to submit article");
      }

      const newArticle = await res.json();
      toast.success(
        formData.status === "published"
          ? "Article published!"
          : "Draft saved!"
      );

      // If published, add to list
      if (formData.status === "published") {
        setArticles([newArticle, ...articles]);
      }

      // Reset form
      setFormData({
        title: "",
        category: CATEGORIES[0],
        body: "",
        status: "draft",
      });
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit article");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen bg-[#FDFAF7]">
        {/* Hero Section */}
        <section className="relative section-padding bg-soft-pattern overflow-hidden">
          <div className="section-container relative z-10 text-center">
            <span className="badge badge-blue mb-6">
              <BookOpen className="size-3.5" /> Insights & Guides
            </span>
            <h1
              className="text-5xl sm:text-6xl text-[#1A2332] tracking-tight mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Learn from founders who've{" "}
              <em className="not-italic text-gradient-primary">shipped</em>
            </h1>
            <p className="text-xl text-[#4A5668] max-w-2xl mx-auto">
              Tactical guides on fundraising, product strategy, and building in
              public. Written by experts and founders in the GSF community.
            </p>

            {isStaff && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="btn-primary mt-8 inline-flex items-center gap-2"
              >
                <Plus className="size-4" /> Write Article
              </button>
            )}
          </div>
        </section>

        {/* Article Form (Staff Only) */}
        <AnimatePresence>
          {showForm && isStaff && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="section-container py-8"
            >
              <div className="card p-8 max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className="text-2xl font-bold text-[#1A2332]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Write an Article
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-[#8A95A3] hover:text-[#1A2332] transition-colors"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A2332] mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Your article title..."
                      className="w-full rounded-lg border border-[#D2C4B4] bg-white px-4 py-3 text-sm text-[#1A2332] placeholder-[#8A95A3] focus:outline-none focus:ring-2 focus:ring-[#81A6C6]"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A2332] mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full rounded-lg border border-[#D2C4B4] bg-white px-4 py-3 text-sm text-[#1A2332] focus:outline-none focus:ring-2 focus:ring-[#81A6C6]"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Body */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A2332] mb-2">
                      Article Content
                    </label>
                    <textarea
                      value={formData.body}
                      onChange={(e) =>
                        setFormData({ ...formData, body: e.target.value })
                      }
                      placeholder="Write your article here... Markdown supported."
                      rows={12}
                      className="w-full rounded-lg border border-[#D2C4B4] bg-white px-4 py-3 text-sm text-[#1A2332] placeholder-[#8A95A3] focus:outline-none focus:ring-2 focus:ring-[#81A6C6] font-mono"
                    />
                    <p className="text-xs text-[#8A95A3] mt-2">
                      Tip: Use # for headings, **bold** for emphasis, and line breaks for paragraphs
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="draft"
                        checked={formData.status === "draft"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as "draft" | "published",
                          })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-[#4A5668]">Save as Draft</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="published"
                        checked={formData.status === "published"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as "draft" | "published",
                          })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-[#4A5668]">Publish Now</span>
                    </label>
                  </div>

                  {/* Submit */}
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary flex items-center gap-2 flex-1"
                    >
                      {submitting ? (
                        <>
                          <Loader className="size-4 animate-spin" /> Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="size-4" /> Submit
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="btn-outline flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Articles List */}
        <section className="section-container py-16">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="size-6 text-[#81A6C6] animate-spin" />
            </div>
          ) : articles.length > 0 ? (
            <div className="space-y-6">
              {articles.map((article) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card p-6 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="badge badge-blue text-xs">
                          {article.category}
                        </span>
                        <span className="text-xs text-[#8A95A3]">
                          {new Date(article.publishedAt || article.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )}
                        </span>
                      </div>
                      <h3
                        className="text-xl font-semibold text-[#1A2332] mb-2 group-hover:text-[#81A6C6] transition-colors"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {article.title}
                      </h3>
                      <p className="text-sm text-[#4A5668] line-clamp-2">
                        {article.body.substring(0, 150)}...
                      </p>
                      <p className="text-xs text-[#8A95A3] mt-3">
                        By <strong>{article.authorName}</strong>
                      </p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="size-12 text-[#D2C4B4] mx-auto mb-4" />
              <p className="text-[#8A95A3]">No articles published yet.</p>
              {isStaff && (
                <p className="text-sm text-[#8A95A3] mt-2">
                  Be the first to contribute! Click "Write Article" above.
                </p>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
