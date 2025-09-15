import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export default function NotificationList() {
  const [notes, setNotes] = useState<any[]>([]);
  useEffect(() => {
    const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => setNotes(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-3">
      {notes.map(n => <div key={n.id} className="bg-white p-3 rounded shadow">{n.message}</div>)}
    </div>
  );
}
