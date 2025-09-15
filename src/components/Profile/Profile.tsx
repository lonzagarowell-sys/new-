import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { uploadToCloudinary } from "../../services/cloudinary";
import { db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Profile() {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [meta, setMeta] = useState<any>(null);

  useEffect(() => {
    setName(user?.displayName || "");
    (async () => {
      if (!user) return;
      const snap = await getDoc(doc(db, "users", user.uid));
      setMeta(snap.exists() ? snap.data() : null);
    })();
  }, [user]);

  const handleSave = async () => {
    if (!user) return alert("Please log in");
    setSaving(true);
    try {
      let photoURL = user.photoURL ?? undefined;
      if (file) {
        photoURL = await uploadToCloudinary(file, `users/${user.uid}`);
      }
      await updateUserProfile({ displayName: name, photoURL });
      // ensure users/{uid} has metadata
      await setDoc(doc(db, "users", user.uid), { uid: user.uid, displayName: name, avatar: photoURL || null, email: user.email }, { merge: true });
      alert("Profile saved");
    } catch (e: any) {
      alert("Error: " + (e.message || e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex justify-center p-8">
      <div className="bg-white p-6 rounded-2xl shadow w-full max-w-md text-center">
        <img src={user?.photoURL || meta?.avatar || "/placeholder.png"} alt="avatar" className="w-28 h-28 rounded-full mx-auto mb-4 object-cover" />
        <input className="w-full p-2 border rounded mb-3" value={name} onChange={e => setName(e.target.value)} />
        <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="mb-3 w-full" />
        <button onClick={handleSave} disabled={saving} className="w-full bg-blue-600 text-white py-2 rounded">
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}
