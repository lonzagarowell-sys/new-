import { useState } from "react";
import { db } from "../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

export default function NotificationPostForm() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const auth = useAuth();
  const isAdmin = auth?.isAdmin === true;

  if (!isAdmin) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    await addDoc(collection(db, "notifications"), {
      title,
      message,
      createdAt: serverTimestamp(),
    });
    setTitle("");
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-6 p-4 bg-gray-100 rounded-lg">
      <h2 className="text-lg font-bold">Send Notification</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Send
      </button>
    </form>
  );
}