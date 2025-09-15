// src/components/Blog/BlogList.tsx
import { useEffect, useState } from "react";
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

type Post = {
  id: string;
  title: string;
  content: string;
  authorUid: string;
};

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { user } = useAuth();

  // For editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Post[];
      setPosts(data);
    });
    return () => unsub();
  }, []);

  const handleDelete = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, "posts", id));
  };

  const startEditing = (post: Post) => {
    setEditingId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const handleUpdate = async (id: string) => {
    if (!user) return;
    const postRef = doc(db, "posts", id);
    await updateDoc(postRef, {
      title: editTitle,
      content: editContent,
    });
    setEditingId(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Blog Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="p-4 border rounded mb-2">
            {editingId === post.id ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="border p-2 w-full mb-2"
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="border p-2 w-full mb-2"
                />
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                  onClick={() => handleUpdate(post.id)}
                >
                  Save
                </button>
                <button
                  className="bg-gray-400 text-white px-3 py-1 rounded"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h3 className="font-semibold">{post.title}</h3>
                <p>{post.content}</p>
                {user?.uid === post.authorUid && (
                  <div className="mt-2 space-x-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                      onClick={() => startEditing(post)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(post.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
