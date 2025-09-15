// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  userData: Record<string, any> | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (payload: { displayName?: string; photoURL?: string }) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setIsAdmin(false);
      setUserData(null);

      if (u) {
        try {
          const userRef = doc(db, "users", u.uid);
          const snap = await getDoc(userRef);

          if (!snap.exists()) {
            // First-time signup → store minimal info
            await setDoc(
              userRef,
              {
                uid: u.uid,
                email: u.email,
                displayName: u.displayName || null,
              },
              { merge: true }
            );
            setUserData({
              uid: u.uid,
              email: u.email,
              displayName: u.displayName || null,
            });
          } else {
            const data = snap.data();
            setUserData(data);
            if (data?.isAdmin) setIsAdmin(true);
          }
        } catch (e) {
          console.warn("user doc check failed", e);
        }
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  // ---------- Auth actions ----------
  const signIn = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password).then(() => {});

  const signUp = async (email: string, password: string, name?: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(cred.user, { displayName: name });
    }
    await setDoc(
      doc(db, "users", cred.user.uid),
      { uid: cred.user.uid, email, displayName: name || null },
      { merge: true }
    );
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    await setDoc(
      doc(db, "users", res.user.uid),
      {
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName || null,
      },
      { merge: true }
    );
  };

  const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

  const logout = () => signOut(auth);

  const updateUserProfile = async (payload: { displayName?: string; photoURL?: string }) => {
    if (!auth.currentUser) throw new Error("No user");

    await updateProfile(auth.currentUser, payload);
    setUser({ ...auth.currentUser } as User);

    await setDoc(
      doc(db, "users", auth.currentUser.uid),
      {
        displayName: payload.displayName ?? auth.currentUser.displayName,
        avatar: payload.photoURL ?? auth.currentUser.photoURL,
      },
      { merge: true }
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        isAdmin,
        signIn,
        signUp,
        signInWithGoogle,
        resetPassword,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
