import React, { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";

export default function ProductCatalog() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), snap => setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  const addFavorite = async (productId: string) => {
    if (!auth.currentUser) return alert("Login");
    await addDoc(collection(db, "favorites"), { uid: auth.currentUser.uid, productId, createdAt: new Date() });
    alert("Added to favorites");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
      {products.map(p => (
        <div key={p.id} className="bg-white p-4 rounded shadow">
          <img src={p.image || "/placeholder.png"} className="w-full h-40 object-cover rounded mb-3" />
          <h4 className="font-semibold">{p.name}</h4>
          <p className="text-gray-600">${p.price}</p>
          <button onClick={() => addFavorite(p.id)} className="mt-3 bg-pink-500 text-white px-3 py-2 rounded">Favorite</button>
        </div>
      ))}
    </div>
  );
}
