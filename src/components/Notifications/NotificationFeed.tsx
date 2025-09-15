import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: any;
}

export default function NotificationFeed() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const { isAdmin } = useAuth();

  // 🔹 Fetch notifications in real-time
  useEffect(() => {
    const q = query(
      collection(db, "notifications"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setNotifications(
        snap.docs.map((d) => {
          const data = d.data() as Omit<Notification, "id">;
          return { id: d.id, ...data };
        })
      );
    });
    return () => unsub();
  }, []);

  // 🔹 Handle delete
  const handleDelete = async (id: string) => {
    if (confirm("Delete this notification?")) {
      await deleteDoc(doc(db, "notifications", id));
    }
  };

  // 🔹 Handle create
  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    await addDoc(collection(db, "notifications"), {
      title,
      message,
      createdAt: serverTimestamp(),
    });

    setTitle("");
    setMessage("");
  };

  return (
    <div className="space-y-6">
      {/* Admin Form */}
      {isAdmin && (
        <form
          onSubmit={handleCreateNotification}
          className="space-y-2 p-4 bg-white shadow rounded-lg"
        >
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Send Notification
          </button>
        </form>
      )}

      {/* Notifications Feed */}
      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="p-4 bg-white rounded-lg shadow flex justify-between"
          >
            <div>
              <h3 className="font-semibold">{n.title}</h3>
              <p className="text-gray-600">{n.message}</p>
              <span className="text-xs text-gray-400">
                {n.createdAt?.toDate
                  ? n.createdAt.toDate().toLocaleString()
                  : "Pending..."}
              </span>
            </div>

            {isAdmin && (
              <div className="flex gap-2 items-start">
                <button
                  onClick={() => handleDelete(n.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <a
                  href={`/notifications/edit/${n.id}`}
                  className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
