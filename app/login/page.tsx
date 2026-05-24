"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Signup Successful 😄");
    }
  };

  const signIn = async () => {

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Login Successful 😄");
    }
  };

  return (
    <main className="bg-black min-h-screen text-white flex items-center justify-center">

      <div className="bg-zinc-900 p-10 rounded-xl w-full max-w-md space-y-6">

        <h1 className="text-4xl font-bold text-red-600">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-black p-4 rounded-lg"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-black p-4 rounded-lg"
        />

        <button
          onClick={signIn}
          className="w-full bg-red-600 py-3 rounded-lg text-lg"
        >
          Login
        </button>

        <button
          onClick={signUp}
          className="w-full bg-zinc-700 py-3 rounded-lg text-lg"
        >
          Sign Up
        </button>

      </div>

    </main>
  );
}