import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function FileList() {
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, "files"), where("uid", "==", auth.currentUser.uid));
    const unsub = onSnapshot(q, snap => setFiles(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {files.map(f => (
        <div key={f.id} className="bg-white p-3 rounded shadow">
          {f.url && <img src={f.url} alt={f.name} className="w-full h-40 object-cover rounded mb-3" />}
          <div className="flex justify-between items-center">
            <span className="font-medium">{f.name}</span>
            <a href={f.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">Download</a>
          </div>
        </div>
      ))}
    </div>
  );
}
