// src/pages/UpdateTask.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";

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

const toYYYYMMDD = (value) => {
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  } catch {
    return "";
  }
};

const UpdateTask = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    deadline: "",
    budget: "",
    authorName: "",
    authorEmail: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(`http://localhost:3000/tasks/${id}`);
        if (!res.ok) throw new Error((await res.text()) || "Failed to load task");
        const data = await res.json(); // expects id/_id, title, category, description, deadline, budget, author
        // Ownership check on client for UX (server enforces too)
        const authorEmail = data?.author?.email || "";
        if (user?.email && authorEmail && user.email.toLowerCase() !== authorEmail.toLowerCase()) {
          setErr("You are not allowed to edit this task.");
          setLoading(false);
          return;
        }
        if (!cancelled) {
          setForm({
            title: data?.title || "",
            category: data?.category || "",
            description: data?.description || "",
            deadline: toYYYYMMDD(data?.deadline),
            budget: typeof data?.budget === "number" ? String(data.budget) : "",
            authorName: data?.author?.name || "",
            authorEmail: authorEmail || "",
          });
        }
      } catch (e) {
        if (!cancelled) setErr(e.message || "Failed to load task");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, user?.email]);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">Please log in</h1>
          <p className="mt-2 text-gray-600">You need to be logged in to update a task.</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-6 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

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
    if (v) {
      setErr(v);
      return;
    }
    setErr("");
    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        category: form.category,
        description: form.description.trim(),
        deadline: form.deadline, // yyyy-mm-dd
        budget: Number(form.budget),
      };

      const res = await fetch(
        `http://localhost:3000/tasks/${encodeURIComponent(id)}?email=${encodeURIComponent(
          user.email
        )}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const text = await res.text();
      if (!res.ok) throw new Error(text || "Failed to update task");

      await Swal.fire({
        title: "Updated",
        text: "Your task has been updated successfully.",
        icon: "success",
        timer: 1600,
        showConfirmButton: false,
      });
      navigate("/my-tasks");
    } catch (e2) {
      await Swal.fire("Update failed", e2.message || "Something went wrong.", "error");
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
          <h1 className="text-2xl font-bold text-gray-900">Update Task</h1>

          {err && (
            <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">
              {err}
            </div>
          )}
          {loading && (
            <div className="rounded-xl bg-blue-50 text-blue-700 px-4 py-3 text-sm">
              Loading task…
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="title">
              Task Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="category">
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
            <label className="block text-sm font-medium text-gray-700" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={form.description}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              required
            />
          </div>

          {/* Deadline & Budget */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="deadline">
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
              <label className="block text-sm font-medium text-gray-700" htmlFor="budget">
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
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
                required
              />
            </div>
          </div>

          {/* Read-only user fields */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="authorEmail">
                User Email
              </label>
              <input
                id="authorEmail"
                type="email"
                value={form.authorEmail}
                readOnly
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="authorName">
                User Name
              </label>
              <input
                id="authorName"
                type="text"
                value={form.authorName}
                readOnly
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 shadow-sm"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 shadow-md shadow-blue-500/20 transition"
            >
              {submitting ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTask;