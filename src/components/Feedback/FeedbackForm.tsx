import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../../firebase";

export default function FeedbackForm() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submit = async (e: any) => {
    e.preventDefault();
    if (!auth.currentUser) return alert("Login");
    await addDoc(collection(db, "feedbacks"), { uid: auth.currentUser.uid, rating, comment, createdAt: new Date() });
    setRating(5); setComment("");
    alert("Thank you for your feedback");
  };

  return (
    <form onSubmit={submit} className="max-w-lg mx-auto p-4 bg-white rounded shadow">
      <h3 className="font-bold mb-2">Leave feedback</h3>
      <label className="block mb-2">Rating</label>
      <select value={rating} onChange={e => setRating(Number(e.target.value))} className="mb-3 p-2 border rounded">
        {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} star</option>)}
      </select>
      <textarea value={comment} onChange={e => setComment(e.target.value)} className="w-full p-2 border rounded mb-3" />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
    </form>
  );
}
