import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  orderBy,
  serverTimestamp,
  type DocumentData
} from "firebase/firestore";

export const addCollectionDoc = (path: string, data: any) => addDoc(collection(db, path), { ...data, createdAt: serverTimestamp() });
export const setDocMerge = (path: string, id: string, data: any) => setDoc(doc(db, path, id), data, { merge: true });
export const updateDocById = (path: string, id: string, data: any) => updateDoc(doc(db, path, id), data);
export const deleteDocById = (path: string, id: string) => deleteDoc(doc(db, path, id));

export const subscribe = (path: string, cb: (items: DocumentData[]) => void, orderField?: string) => {
  const col = collection(db, path);
  const q = orderField ? query(col, orderBy(orderField, "desc")) : col;
  return onSnapshot(q, (snap) => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
};
