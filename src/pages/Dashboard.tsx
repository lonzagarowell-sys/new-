import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const cards = [
    ["Profile", "/profile"],
    ["Chat", "/chat"],
    ["Todo", "/todo"],
    ["Files", "/files"],
    ["Events", "/events"],
    ["Products", "/products"],
    ["Feedback", "/feedback"],
    ["Blog", "/blog"],
    ["Notifications", "/notifications"],
  ];

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-white mb-6">Activities</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map(([title, to]) => (
          <Link
            key={to}
            to={to}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg"
          >
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-gray-500 mt-2">Open {title} activity</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
