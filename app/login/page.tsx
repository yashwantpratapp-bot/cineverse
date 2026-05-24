"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {

  const router = useRouter();

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

      router.push("/");
    }
  };

  const signIn = async () => {

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {

      alert(error.message);

    } else {

      alert("Login Successful 😄");

      router.push("/");
    }
  };

  return (
    <main className="bg-black min-h-screen text-white flex items-center justify-center px-4">

      <div className="bg-zinc-900 p-10 rounded-xl w-full max-w-md space-y-6">

        <h1 className="text-4xl font-bold text-red-600 text-center">
          CINEVERSE
        </h1>

        <p className="text-gray-400 text-center">
          Login or create your account 😄
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full bg-black p-4 rounded-lg outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full bg-black p-4 rounded-lg outline-none"
        />

        <button
          onClick={signIn}
          className="w-full bg-red-600 py-3 rounded-lg text-lg hover:bg-red-700 transition"
        >
          Login
        </button>

        <button
          onClick={signUp}
          className="w-full bg-zinc-700 py-3 rounded-lg text-lg hover:bg-zinc-600 transition"
        >
          Sign Up
        </button>

      </div>

    </main>
  );
}