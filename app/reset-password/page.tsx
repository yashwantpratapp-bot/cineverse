"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {

  const router = useRouter();

  const [password, setPassword] =
    useState("");

  const updatePassword = async () => {

    const { error } =
      await supabase.auth.updateUser({
        password,
      });

    if (error) {

      alert(error.message);

    } else {

      alert("Password updated");

      router.push("/login");
    }
  };

  return (
    <main className="bg-black min-h-screen text-white flex items-center justify-center px-4">

      <div className="bg-zinc-900 p-10 rounded-2xl w-full max-w-md space-y-6">

        <h1 className="text-4xl font-bold text-red-600 text-center">
          Reset Password
        </h1>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full bg-black p-4 rounded-xl outline-none border border-zinc-800"
        />

        <button
          onClick={updatePassword}
          className="w-full bg-red-600 py-3 rounded-xl"
        >
          Update Password
        </button>

      </div>

    </main>
  );
}