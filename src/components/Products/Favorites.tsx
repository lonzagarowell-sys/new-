import { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function Favorites() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const unsubP = onSnapshot(collection(db, "products"), snap => setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsubP();
  }, []);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, "favorites"), where("uid", "==", auth.currentUser.uid));
    const unsub = onSnapshot(q, snap => setFavorites(snap.docs.map(d => d.data())));
    return () => unsub();
  }, []);

  const favProducts = products.filter(p => favorites.some(f => f.productId === p.id));

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {favProducts.length === 0 ? <p className="text-white">No favorites yet.</p> :
        favProducts.map(p => (
          <div key={p.id} className="bg-white p-4 rounded shadow">
            <img src={p.image || "/placeholder.png"} className="w-full h-40 object-cover rounded mb-3" />
            <h4 className="font-semibold">{p.name}</h4>
          </div>
        ))
      }
    </div>
  );
}
