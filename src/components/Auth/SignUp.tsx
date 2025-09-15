import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      await signUp(email, pw, name);
      nav("/dashboard");
    } catch (error: any) {
      setErr(error.message || "Sign up failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={submit} className="bg-white p-8 rounded-2xl shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        {err && <div className="text-red-500 text-sm mb-3">{err}</div>}
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" className="w-full p-2 mb-3 border rounded" />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 mb-3 border rounded" />
        <input value={pw} onChange={e => setPw(e.target.value)} placeholder="Password" type="password" className="w-full p-2 mb-3 border rounded" />
        <button className="w-full bg-green-600 text-white py-2 rounded">Create account</button>
      </form>
    </div>
  );
}
