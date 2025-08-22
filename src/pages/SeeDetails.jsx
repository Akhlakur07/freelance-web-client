// src/pages/SeeDetails.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";

const fmtDate = (d) => {
  try {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return "—";
    return dt.toLocaleDateString();
  } catch {
    return "—";
  }
};

const SeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [bidsCount, setBidsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(
          `http://localhost:3000/tasks/${encodeURIComponent(id)}`
        );
        if (!res.ok)
          throw new Error((await res.text()) || "Failed to load task");
        const data = await res.json(); // expects { id, title, category, description, deadline, budget, author, bidsCount? }
        if (!cancelled) {
          setTask(data);
          setBidsCount(typeof data.bidsCount === "number" ? data.bidsCount : 0);
        }
      } catch (e) {
        if (!cancelled) setErr(e.message || "Failed to load task");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (id) load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleBid = async () => {
    setPlacing(true);
    try {
      const res = await fetch(
        `http://localhost:3000/tasks/${encodeURIComponent(id)}/bid`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json(); // <— instead of text()+JSON.parse
      if (!res.ok) throw new Error(data?.error || "Failed to place bid");

      setBidsCount(
        typeof data.bidsCount === "number" ? data.bidsCount : bidsCount + 1
      );
      // ... SweetAlert success ...
    } catch (e) {
      console.log(e)
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            You bid for <span className="font-semibold">{bidsCount}</span>{" "}
            opportunities.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="rounded-xl border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            Back
          </button>
        </div>

        {err && (
          <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">
            {err}
          </div>
        )}

        {loading ? (
          <div className="rounded-xl bg-blue-50 text-blue-700 px-4 py-3 text-sm">
            Loading…
          </div>
        ) : task ? (
          <article className="rounded-3xl bg-white/90 backdrop-blur-sm shadow-lg p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {task.title}
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Posted by {task.author?.name || task.author?.email || "—"}
                </p>
              </div>
              <span className="rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-medium h-fit">
                {task.category || "—"}
              </span>
            </div>

            <dl className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl bg-gray-50 px-4 py-3">
                <dt className="text-gray-500">Budget</dt>
                <dd className="font-medium text-gray-900">
                  {typeof task.budget === "number" ? task.budget : "—"}
                </dd>
              </div>
              <div className="rounded-xl bg-gray-50 px-4 py-3">
                <dt className="text-gray-500">Deadline</dt>
                <dd className="font-medium text-gray-900">
                  {fmtDate(task.deadline)}
                </dd>
              </div>
              <div className="sm:col-span-2 rounded-xl bg-gray-50 px-4 py-3">
                <dt className="text-gray-500">Description</dt>
                <dd className="mt-1 text-gray-900 whitespace-pre-wrap">
                  {task.description || "—"}
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Current bids: <span className="font-semibold">{bidsCount}</span>
              </p>
              <button
                type="button"
                onClick={handleBid}
                disabled={placing}
                className="rounded-xl bg-blue-600 text-white px-5 py-2.5 font-semibold hover:bg-blue-700 disabled:opacity-60 transition"
              >
                {placing ? "Placing…" : "Bid"}
              </button>
            </div>
          </article>
        ) : null}
      </div>
    </div>
  );
};

export default SeeDetails;
