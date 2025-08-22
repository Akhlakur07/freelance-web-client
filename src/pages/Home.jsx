// src/pages/Home.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import BannerSlider from "../components/BannerSlider";

const slides = [
  {
    image: "https://i.ibb.co.com/8gBytjr9/pexels-jakubzerdzicki-27861771.jpg",
    alt: "Freelancers collaborating",
    kicker: "TaskForce",
    title: "Where talent meets opportunity",
    subtitle: "Post tasks, hire pros, and get work done—fast.",
    ctaText: "Browse Tasks",
    ctaHref: "/browse-tasks",
  },
  {
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    title: "Post your task in minutes",
    kicker: "TaskForce",
    subtitle: "Describe, budget, and publish. We’ll bring the experts.",
    ctaText: "Add Task",
    ctaHref: "/add-task",
  },
  {
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    title: "Work from anywhere",
    kicker: "TaskForce",
    subtitle: "Flexible gigs for developers, designers, writers, and more.",
    ctaText: "Sign Up",
    ctaHref: "/login",
  },
];

const CATEGORIES = [
  "Web Development",
  "Design",
  "Writing",
  "Marketing",
  "Data Entry",
  "Mobile Apps",
  "Customer Support",
  "Other",
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.5, ease: "easeOut" },
  }),
};

const Section = ({ children, className = "" }) => (
  <section className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </section>
);

const Icon = ({ name, className = "h-5 w-5" }) => {
  // tiny inline icon set to avoid extra deps
  switch (name) {
    case "flash":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M11 21h-1l1-7H7l6-11h1l-1 7h4l-6 11z" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3l7 4v5a9 9 0 11-14 0V7l7-4z" />
        </svg>
      );
    case "sparkles":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5zM19 13l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" />
        </svg>
      );
    default:
      return null;
  }
};

const FeatureCard = ({ i, icon, title, text }) => (
  <motion.div
    className="rounded-2xl border border-gray-100 bg-white/90 p-6 shadow-sm hover:shadow transition"
    variants={fadeUp}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.25 }}
    custom={i}
  >
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl bg-blue-600/10 text-blue-700 flex items-center justify-center">
        <Icon name={icon} className="h-5 w-5" />
      </div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
    </div>
    <p className="mt-2 text-sm text-gray-600">{text}</p>
  </motion.div>
);

const CategoryChip = ({ i, label, onClick }) => (
  <motion.button
    variants={fadeUp}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.2 }}
    custom={i}
    onClick={onClick}
    className="px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-sm transition"
  >
    {label}
  </motion.button>
);

const TaskCard = ({ i, t, onSee }) => (
  <motion.article
    variants={fadeUp}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.25 }}
    custom={i}
    className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow transition"
  >
    <div className="flex items-start justify-between gap-3">
      <h4 className="text-lg font-semibold text-gray-900 line-clamp-2">{t.title}</h4>
      <span className="shrink-0 rounded-full bg-blue-50 text-blue-700 px-2.5 py-1 text-xs font-medium">
        {t.category || "—"}
      </span>
    </div>
    <p className="mt-2 text-sm text-gray-700 line-clamp-3">{t.description || "No description."}</p>
    <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
      <div className="rounded-xl bg-gray-50 px-3 py-2">
        <dt className="text-gray-500">Budget</dt>
        <dd className="font-medium text-gray-900">
          {typeof t.budget === "number" ? t.budget : "—"}
        </dd>
      </div>
      <div className="rounded-xl bg-gray-50 px-3 py-2">
        <dt className="text-gray-500">Deadline</dt>
        <dd className="font-medium text-gray-900">
          {(() => {
            const d = new Date(t.deadline);
            return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
          })()}
        </dd>
      </div>
    </dl>
    <div className="mt-5 flex justify-end">
      <button
        onClick={onSee}
        className="rounded-xl bg-blue-600 text-white px-4 py-2.5 font-semibold hover:bg-blue-700 transition"
      >
        See Details
      </button>
    </div>
  </motion.article>
);

const Home = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // load recent tasks (top 6)
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch("http://localhost:3000/tasks", { signal: controller.signal });
        const data = await res.json();
        const normalized = Array.isArray(data) ? data.map((d) => ({ ...d, id: d.id || d._id })) : [];
        setTasks(normalized.slice(0, 6));
      } catch {
        setTasks([]);
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  const featureList = useMemo(
    () => [
      {
        icon: "flash",
        title: "Post fast",
        text: "Create a task with title, budget, and deadline in under a minute.",
      },
      {
        icon: "sparkles",
        title: "Find talent",
        text: "Discover specialists across design, dev, writing, and more.",
      },
      {
        icon: "shield",
        title: "Stay in control",
        text: "You decide the scope, price, and who gets the work.",
      },
    ],
    []
  );

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* HERO */}
      <div className="relative overflow-hidden">
        {/* animated pills in background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -top-16 -left-16 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
        </motion.div>

        <BannerSlider slides={slides} />
      </div>

      {/* FEATURES */}
      <Section className="py-12">
        <motion.h2
          className="text-xl sm:text-2xl font-bold text-gray-900"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          Why TaskForce
        </motion.h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featureList.map((f, i) => (
            <FeatureCard key={f.title} i={i} {...f} />
          ))}
        </div>
      </Section>

      {/* CATEGORIES */}
      <Section className="py-6">
        <motion.div
          className="rounded-3xl border border-gray-100 bg-white/80 p-5 sm:p-6 shadow-sm"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h3 className="text-lg font-semibold text-gray-900">Browse by Category</h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c, i) => (
                <CategoryChip
                  key={c}
                  i={i}
                  label={c}
                  onClick={() => navigate(`/browse-tasks?category=${encodeURIComponent(c)}`)}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </Section>

      {/* FEATURED TASKS */}
      <Section className="py-12">
        <motion.div
          className="flex items-end justify-between gap-3"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Latest tasks</h2>
            <p className="text-sm text-gray-600">Fresh opportunities from the community.</p>
          </div>
          <Link
            to="/browse-tasks"
            className="rounded-xl border border-gray-200 px-4 py-2.5 hover:bg-gray-50 transition text-sm"
          >
            View all
          </Link>
        </motion.div>

        {loading ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-44 rounded-2xl border border-gray-100 bg-white/60 animate-pulse"
              />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600">
            No tasks yet. Be the first to{" "}
            <Link to="/add-task" className="text-blue-600 underline underline-offset-2">
              post a task
            </Link>
            .
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((t, i) => (
              <TaskCard
                key={t.id}
                i={i}
                t={t}
                onSee={() => navigate(`/task/${encodeURIComponent(t.id)}`)}
              />
            ))}
          </div>
        )}
      </Section>

      {/* HOW IT WORKS */}
      <Section className="py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <motion.div
            className="space-y-4"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">How it works</h2>
            <ol className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-3">
                <span className="h-7 w-7 shrink-0 rounded-full bg-blue-600 text-white grid place-items-center text-xs font-semibold">1</span>
                Post your task with scope, budget, and deadline.
              </li>
              <li className="flex gap-3">
                <span className="h-7 w-7 shrink-0 rounded-full bg-blue-600 text-white grid place-items-center text-xs font-semibold">2</span>
                Review bids and profiles from interested pros.
              </li>
              <li className="flex gap-3">
                <span className="h-7 w-7 shrink-0 rounded-full bg-blue-600 text-white grid place-items-center text-xs font-semibold">3</span>
                Pick the match and get it shipped.
              </li>
            </ol>
            <div className="pt-2 flex gap-3">
              <Link
                to="/add-task"
                className="rounded-xl bg-blue-600 text-white px-4 py-2.5 font-semibold hover:bg-blue-700 transition"
              >
                Post a task
              </Link>
              <Link
                to="/browse-tasks"
                className="rounded-xl border border-gray-200 px-4 py-2.5 hover:bg-gray-50 transition"
              >
                Explore tasks
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            {/* playful animated dots */}
            <div className="relative h-56 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100">
              {[...Array(24)].map((_, idx) => (
                <motion.span
                  key={idx}
                  className="absolute h-2 w-2 rounded-full bg-blue-500/50"
                  initial={{ opacity: 0, scale: 0.4 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.02 * idx }}
                  style={{
                    top: `${(idx * 37) % 85}%`,
                    left: `${(idx * 53) % 90}%`,
                  }}
                />
              ))}
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <p className="text-sm text-gray-700">Your workflow</p>
                  <p className="mt-1 text-xl font-semibold text-gray-900">
                    Brief → Bids → Build → Done
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* STATS */}
      <Section className="py-10">
        <motion.div
          className="grid sm:grid-cols-3 gap-5"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {[
            { label: "Tasks posted", value: "1,200+" },
            { label: "Active categories", value: String(CATEGORIES.length) },
            { label: "Avg. response time", value: "< 2 hrs" },
          ].map((s, i) => (
            <div
              key={s.label}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm text-center"
            >
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-sm text-gray-600">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </Section>

      {/* CTA */}
      <Section className="py-14">
        <motion.div
          className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-lg"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold">Ready to get something off your plate?</h3>
              <p className="text-sm text-white/80">Post a task today and start getting bids.</p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/add-task"
                className="rounded-xl bg-white text-blue-700 px-4 py-2.5 font-semibold hover:bg-white/90 transition"
              >
                Add Task
              </Link>
              <Link
                to="/browse-tasks"
                className="rounded-xl border border-white/20 px-4 py-2.5 hover:bg-white/10 transition"
              >
                Browse Tasks
              </Link>
            </div>
          </div>
        </motion.div>
      </Section>
    </div>
  );
};

export default Home;
