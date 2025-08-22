// MyTasks.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";

const MyTasks = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [deleting, setDeleting] = useState(new Set());
  // MyTasks.jsx (add near other useState hooks)
  const [checkingBids, setCheckingBids] = useState(new Set());
  const plural = (n, s, p = s + "s") => (Number(n) === 1 ? s : p);

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(
          `http://localhost:3000/tasks?email=${encodeURIComponent(user.email)}`,
          { signal: controller.signal }
        );
        if (!res.ok)
          throw new Error((await res.text()) || "Failed to load tasks");
        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e.name !== "AbortError")
          setErr(e.message || "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [user?.email]);

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">
            Please log in
          </h1>
          <p className="mt-2 text-gray-600">
            You can only view your own tasks after logging in.
          </p>
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

  const fmtDate = (d) => {
    try {
      const dt = new Date(d);
      if (Number.isNaN(dt.getTime())) return "—";
      return dt.toLocaleDateString();
    } catch {
      return "—";
    }
  };

  const handleDelete = async (task) => {
    const confirm = await Swal.fire({
      title: `Delete “${task.title}”?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
    });
    if (!confirm.isConfirmed) return;

    // mark as deleting
    setDeleting((prev) => {
      const next = new Set(prev);
      next.add(task._id);
      return next;
    });

    try {
      const res = await fetch(
        `http://localhost:3000/tasks/${task._id}?email=${encodeURIComponent(
          user.email
        )}`,
        { method: "DELETE" }
      );
      const text = await res.text();
      if (!res.ok) throw new Error(text || "Failed to delete");

      // remove from UI
      setTasks((prev) => prev.filter((t) => t._id !== task._id));

      await Swal.fire({
        title: "Deleted",
        text: "The task has been removed.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (e) {
      await Swal.fire(
        "Delete failed",
        e.message || "Something went wrong.",
        "error"
      );
    } finally {
      setDeleting((prev) => {
        const next = new Set(prev);
        next.delete(task._id);
        return next;
      });
    }
  };

  // MyTasks.jsx (add this handler below handleDelete)
  const handleBids = async (task) => {
    // mark as checking
    setCheckingBids((prev) => {
      const next = new Set(prev);
      next.add(task._id);
      return next;
    });

    try {
      const res = await fetch(
        `http://localhost:3000/tasks/${encodeURIComponent(task._id)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load bids");

      const count = Number(data?.bidsCount ?? task.bidsCount ?? 0);

      // keep table in sync with latest count
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, bidsCount: count } : t))
      );

      await Swal.fire({
        title: `${count} ${plural(count, "Bid")}`,
        html: `This task currently has <b>${count}</b> ${plural(
          count,
          "bid"
        )}.`,
        icon: "info",
        confirmButtonText: "OK",
      });
    } catch (e) {
      await Swal.fire(
        "Couldn’t load bids",
        e.message || "Something went wrong.",
        "error"
      );
    } finally {
      setCheckingBids((prev) => {
        const next = new Set(prev);
        next.delete(task._id);
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white/90 backdrop-blur-sm shadow-lg p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                My Posted Tasks
              </h1>
              <p className="text-sm text-gray-600">
                Only your tasks are shown here.
              </p>
            </div>
            <button
              onClick={() => navigate("/add-task")}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Add New Task
            </button>
          </div>

          {err && (
            <div className="mt-4 rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">
              {err}
            </div>
          )}

          {loading ? (
            <div className="mt-6 rounded-xl bg-blue-50 text-blue-700 px-4 py-3 text-sm">
              Loading your tasks…
            </div>
          ) : tasks.length === 0 ? (
            <div className="mt-6 rounded-xl border border-gray-200 bg-white px-4 py-6 text-center text-gray-600">
              You haven’t posted any tasks yet.
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deadline
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {tasks.map((t) => {
                    const isDeleting = deleting.has(t._id);
                    return (
                      <tr key={t._id}>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {t.title}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {t.category}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {fmtDate(t.deadline)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {typeof t.budget === "number" ? t.budget : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm"
                              onClick={() =>
                                navigate(
                                  `/update-task/${encodeURIComponent(
                                    t.id || t._id
                                  )}`
                                )
                              }
                              title="Update (not implemented)"
                            >
                              Update
                            </button>
                            <button
                              type="button"
                              className={`px-3 py-1.5 rounded-lg border text-sm ${
                                isDeleting
                                  ? "border-gray-200 bg-gray-100 cursor-not-allowed opacity-60"
                                  : "border-gray-200 hover:bg-gray-50"
                              }`}
                              onClick={() => handleDelete(t)}
                              disabled={isDeleting}
                              aria-busy={isDeleting}
                              title="Delete"
                            >
                              {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                            <button
                              type="button"
                              className={`px-3 py-1.5 rounded-lg text-sm ${
                                checkingBids.has(t._id)
                                  ? "bg-blue-600/60 text-white cursor-wait"
                                  : "bg-blue-600 text-white hover:bg-blue-700"
                              }`}
                              onClick={() => handleBids(t)}
                              disabled={checkingBids.has(t._id)}
                              title="See bids count"
                            >
                              {checkingBids.has(t._id)
                                ? "Checking…"
                                : `Bids${
                                    typeof t.bidsCount === "number"
                                      ? ` (${t.bidsCount})`
                                      : ""
                                  }`}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="mt-3 text-xs text-gray-500">
                Note: Only your tasks are requested and shown. Proper
                server-side checks enforce ownership on delete.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTasks;
