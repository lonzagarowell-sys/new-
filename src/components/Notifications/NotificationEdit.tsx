import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

export default function NotificationEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const isAdmin = userData?.isAdmin === true;

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      const ref = doc(db, "notifications", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setTitle(data.title || "");
        setMessage(data.message || "");
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !id) return;
    await updateDoc(doc(db, "notifications", id), {
      title,
      message,
    });
    navigate("/notifications");
  };

  if (!isAdmin) return <div className="p-8">Not authorized</div>;
  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <form onSubmit={handleSave} className="space-y-3 p-4 bg-white shadow rounded-lg">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 rounded"
        placeholder="Title"
        required
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full border p-2 rounded"
        placeholder="Message"
        required
      />
      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        Save Changes
      </button>
    </form>
  );
}
