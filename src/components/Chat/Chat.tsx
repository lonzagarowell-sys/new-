import React, { useEffect, useRef, useState } from "react";
import { db, auth } from "../../firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

export default function Chat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, snap => setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [messages]);

  const send = async () => {
    if (!auth.currentUser) return alert("Login to send messages");
    if (!text.trim()) return;
    await addDoc(collection(db, "messages"), {
      uid: auth.currentUser.uid,
      displayName: auth.currentUser.displayName || "User",
      text,
      createdAt: serverTimestamp()
    });
    setText("");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div ref={boxRef} className="bg-white p-4 rounded shadow h-96 overflow-auto space-y-3">
        {messages.map(m => (
          <div key={m.id} className={`p-3 rounded ${m.uid === auth.currentUser?.uid ? 'bg-blue-100 self-end ml-auto max-w-2/3' : 'bg-gray-100 max-w-2/3'}`}>
            <div className="text-sm font-semibold">{m.displayName}</div>
            <div>{m.text}</div>
            <div className="text-xs text-gray-400 mt-1">{m.createdAt?.toDate ? m.createdAt.toDate().toLocaleString() : ""}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-3">
        <input value={text} onChange={e => setText(e.target.value)} className="flex-1 p-2 border rounded" />
        <button onClick={send} className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
      </div>
    </div>
  );
}
