"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  // SIGN UP
  const signUp = async () => {

    const { error } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (error) {

      alert(error.message);

    } else {

      alert("Signup Successful");

      router.push("/");
    }
  };

  // LOGIN
  const signIn = async () => {

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {

      alert(error.message);

    } else {

      alert("Login Successful");

      router.push("/");
    }
  };

  // GOOGLE LOGIN
  const googleLogin = async () => {

    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  // FORGOT PASSWORD
  const forgotPassword = async () => {

    if (!email) {

      alert("Enter email first");

      return;
    }

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
         redirectTo:
"https://cineverse-vima.vercel.app/reset-password"
        }
      );

    if (error) {

      alert(error.message);

    } else {

      alert(
        "Password reset email sent"
      );
    }
  };

  return (
    <main className="bg-black min-h-screen text-white flex items-center justify-center px-4">

      <div className="bg-zinc-900 p-10 rounded-2xl w-full max-w-md space-y-6 border border-zinc-800 shadow-2xl">

        {/* Logo */}
        <div className="text-center">

          <h1 className="text-5xl font-bold text-red-600 mb-3">
            CINEVERSE
          </h1>

          <p className="text-gray-400">
            Login or create your account
          </p>

        </div>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full bg-black p-4 rounded-xl outline-none border border-zinc-800 focus:border-red-600 transition"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full bg-black p-4 rounded-xl outline-none border border-zinc-800 focus:border-red-600 transition"
        />

        {/* Forgot Password */}
        <div className="text-right">

          <button
            onClick={forgotPassword}
            className="text-sm text-gray-400 hover:text-white transition cursor-pointer"
          >
            Forgot Password?
          </button>

        </div>

        {/* Login */}
        <button
          onClick={signIn}
          className="w-full bg-red-600 py-3 rounded-xl text-lg hover:bg-red-700 transition"
        >
          Login
        </button>

        {/* Signup */}
        <button
          onClick={signUp}
          className="w-full bg-zinc-700 py-3 rounded-xl text-lg hover:bg-zinc-600 transition"
        >
          Sign Up
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4">

          <div className="flex-1 h-[1px] bg-zinc-700"></div>

          <p className="text-gray-400 text-sm">
            OR
          </p>

          <div className="flex-1 h-[1px] bg-zinc-700"></div>

        </div>

        {/* Google Login */}
        <button
          onClick={googleLogin}
          className="w-full bg-white text-black py-3 rounded-xl text-lg hover:bg-gray-200 transition"
        >

          <div className="flex items-center justify-center gap-3">

            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-6 h-6"
            />

            <span>
              Continue with Google
            </span>

          </div>

        </button>

      </div>

    </main>
  );
}