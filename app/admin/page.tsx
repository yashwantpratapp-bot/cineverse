"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {

  const [title, setTitle] = useState("");

  const [category, setCategory] =
    useState("");

  const [thumbnail, setThumbnail] =
    useState("");

  const [driveLink, setDriveLink] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [authorized, setAuthorized] =
    useState(false);

  useEffect(() => {

    const checkAdmin = async () => {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (
        user?.email ===
        "yashwantpratapp@gmail.com"
      ) {
        setAuthorized(true);
      }

      setLoading(false);
    };

    checkAdmin();

  }, []);

  const addMovie = async () => {

    const { error } = await supabase
      .from("movies")
      .insert([
        {
          title,
          category,
          thumbnail,
          drive_link: driveLink,
        },
      ]);

    if (error) {

      alert(error.message);

    } else {

      alert("Movie Added 😄🔥");

      setTitle("");
      setCategory("");
      setThumbnail("");
      setDriveLink("");
    }
  };

  // Loading Screen
  if (loading) {

    return (
      <main className="bg-black text-white min-h-screen flex items-center justify-center">

        <h1 className="text-4xl font-bold animate-pulse">
          Loading...
        </h1>

      </main>
    );
  }

  // Unauthorized
  if (!authorized) {

    return (
      <main className="bg-black text-white min-h-screen flex items-center justify-center px-4">

        <div className="bg-zinc-900 p-10 rounded-2xl text-center max-w-md w-full border border-red-600">

          <h1 className="text-5xl mb-4">
            ❌
          </h1>

          <h2 className="text-3xl font-bold text-red-600 mb-4">
            Access Denied
          </h2>

          <p className="text-gray-400 leading-7">
            You are not authorized
            to access the admin panel 😄
          </p>

        </div>

      </main>
    );
  }

  return (
    <main className="bg-black min-h-screen text-white flex items-center justify-center px-4 py-10">

      <div className="bg-zinc-900 p-10 rounded-2xl w-full max-w-2xl border border-zinc-800 shadow-2xl">

        {/* Heading */}
        <div className="text-center mb-10">

          <h1 className="text-5xl font-bold text-red-600 mb-4">
            CINEVERSE ADMIN
          </h1>

          <p className="text-gray-400">
            Upload and manage movies 😄🔥
          </p>

        </div>

        {/* Inputs */}
        <div className="space-y-6">

          <input
            type="text"
            placeholder="Movie Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="w-full bg-black p-4 rounded-xl outline-none border border-zinc-800 focus:border-red-600 transition"
          />

          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="w-full bg-black p-4 rounded-xl outline-none border border-zinc-800 focus:border-red-600 transition cursor-pointer"
          >

            <option value="">
              Select Category
            </option>

            <option value="Bollywood">
              Bollywood
            </option>

            <option value="South Movies">
              South Movies
            </option>

            <option value="Web Series">
              Web Series
            </option>

            <option value="Anime">
              Anime
            </option>

          </select>

          <input
            type="text"
            placeholder="Thumbnail URL"
            value={thumbnail}
            onChange={(e) =>
              setThumbnail(e.target.value)
            }
            className="w-full bg-black p-4 rounded-xl outline-none border border-zinc-800 focus:border-red-600 transition"
          />

          <input
            type="text"
            placeholder="Google Drive Preview Link"
            value={driveLink}
            onChange={(e) =>
              setDriveLink(e.target.value)
            }
            className="w-full bg-black p-4 rounded-xl outline-none border border-zinc-800 focus:border-red-600 transition"
          />

          {/* Button */}
          <button
            onClick={addMovie}
            className="w-full bg-red-600 py-4 rounded-xl text-xl font-semibold cursor-pointer hover:bg-red-700 transition duration-300"
          >
            🎬 Publish Movie
          </button>

        </div>

      </div>

    </main>
  );
}