import { useState } from "react";
import { uploadToCloudinary } from "../../services/cloudinary";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../../firebase";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  const upload = async () => {
    if (!file) return alert("Choose a file");
    setLoading(true);
    try {
      // Cloudinary upload
      const secureUrl = await uploadToCloudinary(file, `files/${auth.currentUser?.uid || "anon"}`);
      setUrl(secureUrl);
      // store metadata to Firestore
      if (auth.currentUser) {
        await addDoc(collection(db, "files"), {
          uid: auth.currentUser.uid,
          name: file.name,
          url: secureUrl,
          createdAt: new Date()
        });
      }
    } catch (e: any) {
      alert("Upload failed: " + (e.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h3 className="font-bold mb-3">Upload (Cloudinary)</h3>
      <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="mb-3" />
      <button onClick={upload} disabled={loading} className="bg-green-500 text-white px-4 py-2 rounded">
        {loading ? "Uploading..." : "Upload"}
      </button>
      {url && <div className="mt-3"><a href={url} target="_blank" rel="noreferrer" className="text-blue-600 underline">Open file</a></div>}
    </div>
  );
}
