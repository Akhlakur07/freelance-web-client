import React, { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 text-2xl font-bold cursor-pointer">
            TaskForce
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-10">
            <a href="/" className="hover:text-gray-200 transition">
              Home
            </a>
            <a href="/add-task" className="hover:text-gray-200 transition">
              Add Task
            </a>
            <a href="/browse-tasks" className="hover:text-gray-200 transition">
              Browse Tasks
            </a>
            <a href="/my-tasks" className="hover:text-gray-200 transition">
              My Posted Tasks
            </a>
            <a href="/login" className="hover:text-gray-200 transition">
              Login / Signup
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
            >
              {/* Hamburger icon */}
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
          <a href="/" className="block hover:text-gray-200 transition">
            Home
          </a>
          <a href="/add-task" className="block hover:text-gray-200 transition">
            Add Task
          </a>
          <a
            href="/browse-tasks"
            className="block hover:text-gray-200 transition"
          >
            Browse Tasks
          </a>
          <a href="/my-tasks" className="block hover:text-gray-200 transition">
            My Posted Tasks
          </a>
          <a href="/login" className="block hover:text-gray-200 transition">
            Login / Signup
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
