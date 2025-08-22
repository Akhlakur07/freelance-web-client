// AddTask.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";

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

const AddTask = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [profileName, setProfileName] = useState("");
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    deadline: "",
    budget: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  // Pull name from DB if available; fall back to Firebase displayName
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!user?.email) return setProfileName(user?.displayName || "");
      try {
        const res = await fetch(
          `https://freelance-server-phi.vercel.app/users/${encodeURIComponent(
            user.email
          )}`
        );
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setProfileName(data?.name || user?.displayName || "");
        } else {
          if (!cancelled) setProfileName(user?.displayName || "");
        }
      } catch {
        if (!cancelled) setProfileName(user?.displayName || "");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user?.email, user?.displayName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.title.trim()) return "Title is required.";
    if (!form.category) return "Pick a category.";
    if (!form.description.trim()) return "Description is required.";
    if (!form.deadline) return "Deadline is required.";
    const budgetNum = Number(form.budget);
    if (!Number.isFinite(budgetNum) || budgetNum < 0)
      return "Budget must be a non-negative number.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) return setErr(v);
    setErr("");
    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        category: form.category,
        description: form.description.trim(),
        deadline: form.deadline, // yyyy-mm-dd (server will parse)
        budget: Number(form.budget),
        userEmail: user.email,
        userName: profileName || user.displayName || "",
      };
      const res = await fetch("https://freelance-server-phi.vercel.app/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.text()) || "Failed to add task");
      // Optional: go to "My Posted Tasks"
      navigate("/my-tasks");
    } catch (e2) {
      setErr(e2.message || "Failed to add task.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white/90 backdrop-blur-sm shadow-lg p-8 space-y-6"
        >
          <h1 className="text-2xl font-bold text-gray-900">Post a Task</h1>

          {err && (
            <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">
              {err}
            </div>
          )}

          {/* Title */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="title"
            >
              Task Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Build a landing page"
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="category"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={form.description}
              onChange={handleChange}
              placeholder="What needs to be done?"
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              required
            />
          </div>

          {/* Deadline & Budget */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="deadline"
              >
                Deadline
              </label>
              <input
                id="deadline"
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="budget"
              >
                Budget
              </label>
              <input
                id="budget"
                name="budget"
                type="number"
                min="0"
                step="1"
                value={form.budget}
                onChange={handleChange}
                placeholder="5000"
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
                required
              />
            </div>
          </div>

          {/* Read-only user fields */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="userEmail"
              >
                User Email
              </label>
              <input
                id="userEmail"
                type="email"
                value={user.email}
                readOnly
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 shadow-sm"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="userName"
              >
                User Name
              </label>
              <input
                id="userName"
                type="text"
                value={profileName}
                readOnly
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 shadow-sm"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 shadow-md shadow-blue-500/20 transition"
            >
              {submitting ? "Adding..." : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
