import React, { useEffect, useState } from "react";
import { rdb, auth } from "../../firebase";
import { ref, push, onValue, update, remove } from "firebase/database";

export default function TodoList() {
  const [todos, setTodos] = useState<Record<string, any>>({});
  const [text, setText] = useState("");

  useEffect(() => {
    if (!auth.currentUser) return;
    const r = ref(rdb, `todos/${auth.currentUser.uid}`);
    const unsub = onValue(r, snap => setTodos(snap.val() || {}));
    return () => unsub();
  }, []);

  const add = async () => {
    if (!auth.currentUser) return alert("Login");
    await push(ref(rdb, `todos/${auth.currentUser.uid}`), { text, completed: false, createdAt: Date.now() });
    setText("");
  };

  const toggle = async (key: string, val: any) => {
    if (!auth.currentUser) return;
    await update(ref(rdb, `todos/${auth.currentUser.uid}/${key}`), { completed: !val.completed });
  };

  const del = async (key: string) => {
    if (!auth.currentUser) return;
    await remove(ref(rdb, `todos/${auth.currentUser.uid}/${key}`));
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-3 text-white">My Todos</h2>
      <div className="flex gap-2 mb-4">
        <input className="flex-1 p-2 rounded" value={text} onChange={e => setText(e.target.value)} />
        <button onClick={add} className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </div>
      <ul className="space-y-2">
        {Object.entries(todos).map(([k, v]: any) => (
          <li key={k} className="bg-white p-3 rounded shadow flex justify-between items-center">
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={v.completed} onChange={() => toggle(k, v)} />
              <span className={v.completed ? "line-through text-gray-500" : ""}>{v.text}</span>
            </div>
            <button onClick={() => del(k)} className="text-red-500">✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
