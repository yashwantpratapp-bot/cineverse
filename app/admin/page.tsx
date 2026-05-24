"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [drive_link, setDriveLink] = useState("");

  const addMovie = async () => {

    const { error } = await supabase
      .from("movies")
      .insert([
        {
          title,
          category,
          thumbnail,
          drive_link,
        },
      ]);

    if (error) {
      alert(error.message);
    } else {
      alert("Movie Added 😄");

      setTitle("");
      setCategory("");
      setThumbnail("");
      setDriveLink("");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-4xl font-bold mb-10 text-red-600">
        Admin Panel
      </h1>

      <div className="max-w-xl space-y-5">

        <input
          type="text"
          placeholder="Movie Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-4 rounded-lg bg-zinc-900 outline-none"
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-4 rounded-lg bg-zinc-900 outline-none"
        />

        <input
          type="text"
          placeholder="Thumbnail URL"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          className="w-full p-4 rounded-lg bg-zinc-900 outline-none"
        />

        <input
          type="text"
          placeholder="Drive Link"
          value={drive_link}
          onChange={(e) => setDriveLink(e.target.value)}
          className="w-full p-4 rounded-lg bg-zinc-900 outline-none"
        />

        <button
          onClick={addMovie}
          className="bg-red-600 px-8 py-4 rounded-lg w-full text-lg font-semibold"
        >
          Publish Movie
        </button>

      </div>
    </div>
  );
}