import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { signIn, signInWithGoogle, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      await signIn(email, pw);
      nav("/dashboard"); // ✅ redirect after email login
    } catch (error: any) {
      setErr(error.message || "Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    setErr(null);
    try {
      await signInWithGoogle();
      nav("/dashboard"); // ✅ redirect after Google login
    } catch (error: any) {
      setErr(error.message || "Google login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={submit}
        className="bg-white p-8 rounded-2xl shadow w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {err && <div className="text-red-500 text-sm mb-3">{err}</div>}

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Password"
          type="password"
          className="w-full p-2 mb-3 border rounded"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded mb-2">
          Login
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white py-2 rounded mb-2"
        >
          Sign in with Google
        </button>

        <button
          type="button"
          onClick={() => resetPassword(email)}
          className="text-sm text-blue-600 hover:underline"
        >
          Forgot password?
        </button>
      </form>
    </div>
  );
}
