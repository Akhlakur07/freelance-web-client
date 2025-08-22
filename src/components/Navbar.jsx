import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dbUser, setDbUser] = useState(null); // ⬅️ holds profile from backend
  const navigate = useNavigate();
  const { user, logOut } = useContext(AuthContext);

  // Fetch profile from backend when Firebase user is present
  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      setDbUser(null);
      if (!user?.email) return;
      try {
        const res = await fetch(
          `http://localhost:3000/users/${encodeURIComponent(user.email)}`
        );
        if (!res.ok) return; // ignore if not found
        const data = await res.json();
        if (!cancelled) setDbUser(data);
      } catch {
        if (!cancelled) setDbUser(null);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  const Avatar = () => {
    const src = dbUser?.photo || user?.photoURL || "";
    return src ? (
      <img
        src={src}
        alt="Profile"
        className="h-9 w-9 rounded-full object-cover ring-2 ring-white/80"
      />
    ) : (
      <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20 21a8 8 0 10-16 0" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
    );
  };

  return (
    <nav className="bg-blue-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 text-2xl font-bold">
            TaskForce
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            <Link to="/" className="hover:text-gray-200 transition">
              Home
            </Link>
            <Link to="/add-task" className="hover:text-gray-200 transition">
              Add Task
            </Link>
            <Link to="/browse-tasks" className="hover:text-gray-200 transition">
              Browse Tasks
            </Link>
            <Link to="/my-tasks" className="hover:text-gray-200 transition">
              My Posted Tasks
            </Link>
          </div>

          {/* Right side (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/profile" className="hover:opacity-90 transition">
                  <Avatar />
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-white/15 hover:bg白/25 hover:bg-white/25 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-white/15 hover:bg-white/25 transition"
              >
                Login / Signup
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Items */}
      {isOpen && (
        <div className="md:hidden bg-blue-400 px-4 pb-3 space-y-2">
          <Link to="/" className="block hover:text-gray-200 transition">
            Home
          </Link>
          <Link to="/add-task" className="block hover:text-gray-200 transition">
            Add Task
          </Link>
          <Link
            to="/browse-tasks"
            className="block hover:text-gray-200 transition"
          >
            Browse Tasks
          </Link>
          <Link to="/my-tasks" className="block hover:text-gray-200 transition">
            My Posted Tasks
          </Link>

          {user ? (
            <div className="flex items-center justify-between pt-2">
              <Link to="/profile" className="flex items-center gap-2">
                <Avatar />
                <span className="text-sm">
                  {dbUser?.name || user?.displayName || "Profile"}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 transition text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="block hover:text-gray-200 transition">
              Login / Signup
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
