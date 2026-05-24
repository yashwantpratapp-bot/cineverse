"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ClientHome({
  movies,
}: {
  movies: any[];
}) {

  const [search, setSearch] = useState("");

  const [user, setUser] = useState<any>(null);

  const [darkMode, setDarkMode] =
    useState(true);

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  useEffect(() => {

    checkUser();

  }, []);

  const checkUser = async () => {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
  };

  const logout = async () => {

    await supabase.auth.signOut();

    alert("Logged out 😄");

    window.location.reload();
  };

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
    <main
      className={`min-h-screen transition duration-500 ${
        darkMode
          ? "bg-black text-white"
          : "bg-white text-black"
      }`}
    >

      {/* Navbar */}
      <div
        className={`flex flex-col md:flex-row md:items-center md:justify-between px-4 md:px-8 py-4 sticky top-0 z-50 gap-4 ${
          darkMode
            ? "bg-black"
            : "bg-white border-b"
        }`}
      >

        <h1 className="text-3xl font-bold text-red-600">
          CINEVERSE
        </h1>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">

          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`px-4 py-2 rounded-lg outline-none w-full md:w-72 ${
              darkMode
                ? "bg-zinc-900 text-white"
                : "bg-zinc-200 text-black"
            }`}
          />

          {/* Theme Button */}
          <button
            onClick={() =>
              setDarkMode(!darkMode)
            }
            className={`px-4 py-2 rounded-lg cursor-pointer transition ${
              darkMode
                ? "bg-zinc-800 hover:bg-zinc-700"
                : "bg-zinc-300 hover:bg-zinc-400"
            }`}
          >
            {darkMode ? "☀ Light" : "🌙 Dark"}
          </button>

          {user ? (

            <div className="flex gap-2">

              <Link
                href="/profile"
                className="bg-zinc-800 px-5 py-2 rounded-lg whitespace-nowrap cursor-pointer hover:bg-zinc-700 transition"
              >
                Profile
              </Link>

              <button
                onClick={logout}
                className="bg-red-600 px-5 py-2 rounded-lg whitespace-nowrap cursor-pointer hover:bg-red-700 transition"
              >
                Logout
              </button>

            </div>

          ) : (

            <Link
              href="/login"
              className="bg-red-600 px-5 py-2 rounded-lg whitespace-nowrap cursor-pointer hover:bg-red-700 transition"
            >
              Login
            </Link>

          )}

        </div>

      </div>

      {/* Category Buttons */}
      <div className="flex gap-3 px-4 md:px-8 py-4 overflow-x-auto">

        {[
          "All",
          "Bollywood",
          "South Movies",
          "Web Series",
          "Anime",
        ].map((category) => (

          <button
            key={category}
            onClick={() =>
              setSelectedCategory(category)
            }
            className={`px-5 py-2 rounded-lg whitespace-nowrap cursor-pointer transition ${
              selectedCategory === category
                ? "bg-red-600"
                : darkMode
                ? "bg-zinc-800 hover:bg-zinc-700"
                : "bg-zinc-300 hover:bg-zinc-400"
            }`}
          >
            {category}
          </button>

        ))}

      </div>

      {/* Hero */}
      <div
        className="h-[60vh] md:h-[70vh] bg-cover bg-center flex items-end"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c')",
        }}
      >
        <div className="bg-gradient-to-t from-black w-full p-6 md:p-10">

          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
            WATCH MOVIES ONLINE
          </h1>

          <p className="max-w-2xl text-gray-300 text-base md:text-lg mb-6">
            Stream Bollywood, South Movies and Web Series online.
          </p>

          <button className="bg-red-600 px-8 py-3 rounded-lg text-lg cursor-pointer hover:bg-red-700 transition">
            ▶ Watch Now
          </button>

        </div>

      </div>

      {/* Movies */}
      <div className="p-4 md:p-8">

        <h2 className="text-3xl font-bold mb-8">
          Latest Movies
        </h2>

        {filteredMovies.length === 0 ? (

          <p className="text-gray-400">
            No movies found 😄
          </p>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

            {filteredMovies.map((movie) => (

              <div
                key={movie.id}
                className={`rounded-xl overflow-hidden hover:scale-105 transition duration-300 ${
                  darkMode
                    ? "bg-zinc-900"
                    : "bg-zinc-200"
                }`}
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
                      className="flex-1 bg-red-600 py-2 rounded-lg text-center cursor-pointer hover:bg-red-700 transition"
                    >
                      Watch
                    </Link>

                    <a
                      href={movie.drive_link}
                      target="_blank"
                      className={`flex-1 py-2 rounded-lg text-center cursor-pointer transition ${
                        darkMode
                          ? "bg-zinc-700 hover:bg-zinc-600"
                          : "bg-zinc-400 hover:bg-zinc-500"
                      }`}
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
      {/* Premium Footer */}
      <footer
        className={`border-t mt-20 ${
          darkMode
            ? "bg-zinc-950 border-zinc-800"
            : "bg-zinc-100 border-zinc-300"
        }`}
      >

        <div className="max-w-7xl mx-auto px-6 py-14">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

            {/* Brand */}
            <div>

              <h1 className="text-4xl font-bold text-red-600 mb-4">
                CINEVERSE
              </h1>

              <p className="text-gray-400 leading-7">
                Watch Bollywood, South Movies,
                Anime and Web Series online 😄🔥
              </p>

            </div>

            {/* Navigation */}
            <div>

              <h2 className="text-xl font-semibold mb-5">
                Navigation
              </h2>

              <div className="flex flex-col gap-3 text-gray-400">

                <Link
                  href="/"
                  className="hover:text-white transition"
                >
                  Home
                </Link>

                <Link
                  href="/profile"
                  className="hover:text-white transition"
                >
                  Profile
                </Link>

                <Link
                  href="/login"
                  className="hover:text-white transition"
                >
                  Login
                </Link>

              </div>

            </div>

            {/* Categories */}
            <div>

              <h2 className="text-xl font-semibold mb-5">
                Categories
              </h2>

              <div className="flex flex-col gap-3 text-gray-400">

                <p className="hover:text-white transition cursor-pointer">
                  Bollywood
                </p>

                <p className="hover:text-white transition cursor-pointer">
                  South Movies
                </p>

                <p className="hover:text-white transition cursor-pointer">
                  Anime
                </p>

                <p className="hover:text-white transition cursor-pointer">
                  Web Series
                </p>

              </div>

            </div>

            {/* Social */}
            <div>

              <h2 className="text-xl font-semibold mb-5">
                Follow Us
              </h2>

              <div className="flex gap-4">

                <div className="bg-zinc-800 hover:bg-red-600 transition p-4 rounded-full cursor-pointer">
                  📸
                </div>

                <div className="bg-zinc-800 hover:bg-red-600 transition p-4 rounded-full cursor-pointer">
                  ▶
                </div>

                <div className="bg-zinc-800 hover:bg-red-600 transition p-4 rounded-full cursor-pointer">
                  💬
                </div>

              </div>

            </div>

          </div>

          {/* Bottom */}
          <div className="border-t border-zinc-800 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">

            <p className="text-gray-500 text-sm">
              © 2026 CINEVERSE. All Rights Reserved.
            </p>

            <div className="flex gap-6 text-gray-500 text-sm">

              <p className="hover:text-white cursor-pointer transition">
                Privacy Policy
              </p>

              <p className="hover:text-white cursor-pointer transition">
                Terms of Service
              </p>

              <p className="hover:text-white cursor-pointer transition">
                Contact
              </p>

            </div>

          </div>

        </div>

      </footer>
    </main>
  );
}