"use client";

import Link from "next/link";
import { useState } from "react";

export default function ClientHome({
  movies,
}: {
  movies: any[];
}) {

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const filteredMovies = movies.filter((movie) => {

    const matchesSearch = movie.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      movie.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="bg-black min-h-screen text-white">

      {/* Navbar */}
      <div className="flex items-center justify-between px-8 py-4 bg-black sticky top-0 z-50">

        <h1 className="text-3xl font-bold text-red-600">
          CINEVERSE
        </h1>

        <div className="flex items-center gap-4">

          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-zinc-900 px-4 py-2 rounded-lg outline-none w-72"
          />

          <Link
            href="/login"
            className="bg-red-600 px-5 py-2 rounded-lg"
          >
            Login
          </Link>

        </div>

      </div>

      {/* Category Buttons */}
      <div className="flex gap-3 px-8 py-4 overflow-x-auto">

        {[
          "All",
          "Bollywood",
          "South Movies",
          "Web Series",
          "Anime",
        ].map((category) => (

          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2 rounded-lg whitespace-nowrap ${
              selectedCategory === category
                ? "bg-red-600"
                : "bg-zinc-800"
            }`}
          >
            {category}
          </button>

        ))}

      </div>

      {/* Hero */}
      <div
        className="h-[70vh] bg-cover bg-center flex items-end"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c')",
        }}
      >
        <div className="bg-gradient-to-t from-black w-full p-10">

          <h1 className="text-6xl font-bold mb-4">
            WATCH MOVIES ONLINE
          </h1>

          <p className="max-w-2xl text-gray-300 text-lg mb-6">
            Stream Bollywood, South Movies and Web Series online.
          </p>

          <button className="bg-red-600 px-8 py-3 rounded-lg text-lg">
            ▶ Watch Now
          </button>

        </div>
      </div>

      {/* Movies */}
      <div className="p-8">

        <h2 className="text-3xl font-bold mb-8">
          Latest Movies
        </h2>

        {filteredMovies.length === 0 ? (

          <p className="text-gray-400">
            No movies found 😄
          </p>

        ) : (

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            {filteredMovies.map((movie) => (

              <div
                key={movie.id}
                className="bg-zinc-900 rounded-xl overflow-hidden hover:scale-105 transition duration-300"
              >

                <img
                  src={
                    movie.thumbnail ||
                    "https://via.placeholder.com/400x600?text=No+Image"
                  }
                  alt={movie.title}
                  className="w-full h-72 object-cover"
                />

                <div className="p-4">

                  <h3 className="text-xl font-semibold">
                    {movie.title}
                  </h3>

                  <p className="text-gray-400 mt-2">
                    {movie.category}
                  </p>

                  <div className="flex gap-2 mt-4">

                    <Link
                      href={`/movie/${movie.id}`}
                      className="flex-1 bg-red-600 py-2 rounded-lg text-center"
                    >
                      Watch
                    </Link>

                    <a
                      href={movie.drive_link}
                      target="_blank"
                      className="flex-1 bg-zinc-700 py-2 rounded-lg text-center"
                    >
                      Download
                    </a>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}