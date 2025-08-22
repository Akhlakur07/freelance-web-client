// src/pages/BrowseTask.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

const CATEGORIES = [
  "All",
  "Web Development",
  "Design",
  "Writing",
  "Marketing",
  "Data Entry",
  "Mobile Apps",
  "Customer Support",
  "Other",
];

const fmtDate = (d) => {
  try {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return "—";
    return dt.toLocaleDateString();
  } catch {
    return "—";
  }
};

const BrowseTask = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [category, setCategory] = useState("All");
  const [q, setQ] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch("http://localhost:3000/tasks", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error((await res.text()) || "Failed to load tasks");
        const data = await res.json();

        const normalized = Array.isArray(data)
          ? data.map((t) => ({ ...t, id: t.id || t._id }))
          : [];
        setTasks(normalized);
      } catch (e) {
        if (e.name !== "AbortError") setErr(e.message || "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const byCat = category === "All" || t.category === category;
      const text = (t.title + " " + t.description + " " + (t.category || "")).toLowerCase();
      const byQ = !q.trim() || text.includes(q.trim().toLowerCase());
      return byCat && byQ;
    });
  }, [tasks, category, q]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Browse Tasks</h1>
            <p className="text-sm text-gray-600">
              Explore what others have posted. Click “See Details” to view a task.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title, description…"
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
            />
          </div>
        </div>

        {/* States */}
        {err && (
          <div className="mt-6 rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">
            {err}
          </div>
        )}
        {loading && (
          <div className="mt-6 rounded-xl bg-blue-50 text-blue-700 px-4 py-3 text-sm">
            Loading tasks…
          </div>
        )}

        {/* Grid */}
        {!loading && !err && (
          <>
            {filtered.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600">
                No tasks found. Try a different category or search.
              </div>
            ) : (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((t) => (
                  <article
                    key={t.id}
                    className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {t.title}
                      </h2>
                      <span className="shrink-0 rounded-full bg-blue-50 text-blue-700 px-2.5 py-1 text-xs font-medium">
                        {t.category || "—"}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-700 line-clamp-3">
                      {t.description || "No description"}
                    </p>

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
                          {fmtDate(t.deadline)}
                        </dd>
                      </div>
                      <div className="rounded-xl bg-gray-50 px-3 py-2 col-span-2">
                        <dt className="text-gray-500">Posted by</dt>
                        <dd className="font-medium text-gray-900">
                          {t.author?.name || t.author?.email || "—"}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-5 flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/task/${encodeURIComponent(t.id)}`)
                        }
                        className="rounded-xl bg-blue-600 text-white px-4 py-2.5 font-semibold hover:bg-blue-700 transition"
                        title="See Details"
                      >
                        See Details
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BrowseTask;
