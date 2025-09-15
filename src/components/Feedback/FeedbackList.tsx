import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export default function FeedbackList() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    const q = query(collection(db, "feedbacks"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => setItems(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  const avg = items.length ? (items.reduce((s,a) => s + (a.rating || 0), 0) / items.length).toFixed(2) : "0.00";

  return (
    <div className="max-w-lg mx-auto p-4">
      <h3 className="font-bold">Average rating: {avg}</h3>
      <ul className="mt-3 space-y-3">
        {items.map(f => <li key={f.id} className="bg-white p-3 rounded shadow">{f.rating}★ — {f.comment}</li>)}
      </ul>
    </div>
  );
}
