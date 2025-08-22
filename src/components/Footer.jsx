// Footer.jsx
import React, { useState } from "react";
import { Link } from "react-router";

const Footer = () => {
  const [email, setEmail] = useState("");
  const year = new Date().getFullYear();

  const onSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    // TODO: wire up to backend or email provider
    setEmail("");
    alert("Thanks for subscribing!");
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand / About */}
          <div>
            <Link to="/" className="text-white text-2xl font-bold">
              TaskForce
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              Post, discover, and manage tasks with ease. Built for speed and simplicity.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-1.5 text-xs text-gray-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>All systems operational</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold">Contact</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                {/* mail icon */}
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16v16H4z" />
                  <path d="M22 6l-10 7L2 6" />
                </svg>
                <a href="mailto:support@taskforce.app" className="hover:text-white">
                  support@taskforce.app
                </a>
              </li>
              <li className="flex items-start gap-2">
                {/* phone icon */}
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92V21a1 1 0 01-1.1 1A19 19 0 013 4.1 1 1 0 014 3h4.09a1 1 0 011 .75l1 3.5a1 1 0 01-.29 1L8.5 9.5a16 16 0 006 6l1.25-1.34a1 1 0 011-.28l3.5 1a1 1 0 01.75 1z" />
                </svg>
                <a href="tel:+8801000000000" className="hover:text-white">
                  +880 1000-000000
                </a>
              </li>
              <li className="flex items-start gap-2">
                {/* pin icon */}
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z" />
                  <circle cx="12" cy="11" r="3" />
                </svg>
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-start gap-2">
                {/* clock icon */}
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" />
                </svg>
                <span>Support: Sat–Thu, 10:00–18:00 BST</span>
              </li>
            </ul>
          </div>

          {/* Quick Links / Legal */}
          <div>
            <h3 className="text-white font-semibold">Links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/browse-tasks" className="hover:text-white">Browse Tasks</Link>
              </li>
              <li>
                <Link to="/add-task" className="hover:text-white">Post a Task</Link>
              </li>
              <li>
                <Link to="/my-tasks" className="hover:text-white">My Posted Tasks</Link>
              </li>
              <li className="pt-2">
                <Link to="/terms" className="hover:text-white">Terms &amp; Conditions</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-white">Cookie Policy</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold">Stay in the loop</h3>
            <p className="mt-3 text-sm text-gray-400">
              Get product updates and tips. No spam.
            </p>
            <form onSubmit={onSubscribe} className="mt-4 flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                required
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700 transition"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-2 text-[11px] text-gray-500">
              By subscribing you agree to our{" "}
              <Link to="/terms" className="underline hover:text-white">Terms</Link>.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">
            © {year} TaskForce. All rights reserved.
          </p>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a
              href="https://facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="hover:text-white"
              title="Facebook"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M22 12a10 10 0 10-11.6 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 3h-1.9v7A10 10 0 0022 12z" />
              </svg>
            </a>
            <a
              href="https://x.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="X (Twitter)"
              className="hover:text-white"
              title="X"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M17.3 3H20l-6.5 7.4L21 21h-6.6l-5.2-6.5L3.8 21H1l7.3-8.3L3 3h6.6l4.7 5.9L17.3 3z" />
              </svg>
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-white"
              title="Instagram"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3.5A5.5 5.5 0 1112 20.5 5.5 5.5 0 0112 7.5zm0 2A3.5 3.5 0 1015.5 13 3.5 3.5 0 0012 9.5zM18 6.5a1 1 0 110 2 1 1 0 010-2z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="hover:text-white"
              title="LinkedIn"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 5 2.12 5 3.5zM0 8h5v16H0zM8 8h4.8v2.2h.1c.7-1.3 2.4-2.7 4.9-2.7 5.2 0 6.2 3.4 6.2 7.8V24h-5v-6.9c0-1.6 0-3.7-2.2-3.7s-2.6 1.7-2.6 3.5V24H8z" />
              </svg>
            </a>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="hover:text-white"
              title="GitHub"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M12 .5A12 12 0 000 12.7c0 5.4 3.4 9.9 8.2 11.5.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.5-1.4-1.9-1.4-1.9-1.2-.9.1-.9.1-.9 1.3.1 2 .9 2 .9 1.1 2 2.8 1.4 3.4 1.1.1-.8.4-1.4.7-1.7-2.6-.3-5.2-1.3-5.2-5.8 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.3 0 0 1-.3 3.3 1.2a11.2 11.2 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 3 .1 3.3.8.8 1.2 1.9 1.2 3.2 0 4.5-2.7 5.4-5.2 5.8.4.3.8 1 .8 2.1v3.1c0 .3.2.7.8.6A12 12 0 0024 12.7 12 12 0 0012 .5z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Back to top */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
            aria-label="Back to top"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5" />
              <path d="M5 12l7-7 7 7" />
            </svg>
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;