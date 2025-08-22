// Profile.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    photo: "",
    bio: "",
  });

  const email = user?.email || "";

  // Load existing profile from DB (fallback to Firebase)
  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      setLoading(true);
      setErr("");
      setOk("");

      if (!email) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:3000/users/${encodeURIComponent(email)}`
        );

        if (res.status === 404) {
          // No DB doc — fallback to Firebase fields
          if (!cancelled) {
            setForm({
              name: user?.displayName || "",
              email: user?.email || "",
              photo: user?.photoURL || "",
              bio: "",
            });
          }
        } else if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to load profile");
        } else {
          const data = await res.json();
          if (!cancelled) {
            setForm({
              name: data?.name || user?.displayName || "",
              email: data?.email || user?.email || "",
              photo: data?.photo || user?.photoURL || "",
              bio: data?.bio || "",
            });
          }
        }
      } catch (e) {
        if (!cancelled) {
          setErr(e.message || "Failed to load profile");
          // Still allow editing with Firebase fallback
          setForm({
            name: user?.displayName || "",
            email: user?.email || "",
            photo: user?.photoURL || "",
            bio: "",
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchUser();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const saveUserToBackend = async (payload) => {
    const res = await fetch("http://localhost:3000/users", {
      method: "POST", // upsert
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error((await res.text()) || "Failed to save user");
    return res.json();
  };

  const [submitting, setSubmitting] = useState(false);
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.email) return;

    setSubmitting(true);
    setErr("");
    setOk("");

    try {
      // 1) Update Firebase displayName/photoURL (if available)
      try {
        await updateUser({
          displayName: form.name || null,
          photoURL: form.photo || null,
        });
      } catch {
        // Not fatal if Firebase profile update fails; DB will still persist
      }

      // 2) Upsert to Mongo
      const payload = {
        name: form.name,
        email: form.email,
        photo: form.photo,
        bio: form.bio,
        authProvider:
          user?.providerData?.[0]?.providerId?.replace(".com", "") || "password",
        updatedAt: new Date().toISOString(),
      };
      await saveUserToBackend(payload);

      setOk("Profile updated.");
    } catch (e) {
      setErr(e.message || "Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">
            You’re not logged in
          </h1>
          <p className="mt-2 text-gray-600">Please log in to view your profile.</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSave}
          className="rounded-3xl bg-white/90 backdrop-blur-sm shadow-lg p-8"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            {form.photo ? (
              <img
                src={form.photo}
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover ring-2 ring-blue-100 shadow"
                onError={(e) => {
                  e.currentTarget.src =
                    "data:image/svg+xml;utf8," +
                    encodeURIComponent(
                      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"/>'
                    );
                }}
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center ring-2 ring-blue-100 shadow">
                <svg
                  viewBox="0 0 24 24"
                  className="h-10 w-10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21a8 8 0 10-16 0" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            )}

            <div className="flex-1 w-full text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
              <p className="text-gray-600">{form.email}</p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 sm:mt-0 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition"
            >
              {submitting ? "Saving..." : "Save changes"}
            </button>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 gap-6">
            {/* Name */}
            <div className="rounded-2xl border border-gray-100 p-5">
              <label className="text-sm font-semibold text-gray-700" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
            </div>

            {/* Photo URL */}
            <div className="rounded-2xl border border-gray-100 p-5">
              <label className="text-sm font-semibold text-gray-700" htmlFor="photo">
                Photo URL
              </label>
              <input
                id="photo"
                name="photo"
                type="url"
                value={form.photo}
                onChange={handleChange}
                placeholder="https://example.com/you.jpg"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                Paste a direct link to an image.
              </p>
            </div>

            {/* Bio */}
            <div className="sm:col-span-2 rounded-2xl border border-gray-100 p-5">
              <label className="text-sm font-semibold text-gray-700" htmlFor="bio">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={form.bio}
                onChange={handleChange}
                placeholder="A few words about you…"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
            </div>
          </div>

          {/* Status messages */}
          {loading && (
            <div className="mt-6 rounded-xl bg-blue-50 text-blue-700 px-4 py-3 text-sm">
              Loading your profile…
            </div>
          )}
          {err && (
            <div className="mt-6 rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">
              {err}
            </div>
          )}
          {ok && (
            <div className="mt-6 rounded-xl bg-green-50 text-green-700 px-4 py-3 text-sm">
              {ok}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;