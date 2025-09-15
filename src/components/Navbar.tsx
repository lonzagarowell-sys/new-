import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  // handle logout + redirect
  const handleLogout = async () => {
    try {
      await logout();           // sign out (from AuthContext)
      navigate("/login");       // instantly go to login page
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <nav className="bg-blue-800 text-white px-6 py-3 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold">Activities</Link>
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/chat" className="hover:underline">Chat</Link>
          <Link to="/todo" className="hover:underline">Todo</Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/profile" className="px-3 py-1 rounded bg-blue-600">Profile</Link>
              <Link to="/files" className="px-3 py-1 rounded bg-green-600">Files</Link>
              {isAdmin && (
                <Link to="/notifications" className="px-3 py-1 rounded bg-purple-500 text-white">
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded bg-red-500 hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1 rounded bg-white text-blue-800">Login</Link>
              <Link to="/signup" className="px-3 py-1 rounded bg-green-500">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
