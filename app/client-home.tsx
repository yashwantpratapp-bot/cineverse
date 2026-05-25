"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ClientHome({
  movies,
}: {
  movies: any[];
}) {

  const [search, setSearch] =
    useState("");

  const [user, setUser] =
    useState<any>(null);

  const [darkMode, setDarkMode] =
    useState(true);

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("All");

  const [showMenu, setShowMenu] =
    useState(false);

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

    alert("Logged out");

    window.location.reload();
  };

  const filteredMovies =
    movies.filter((movie) => {

      const matchesSearch =
        movie.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesCategory =
        selectedCategory ===
          "All" ||
        movie.category ===
          selectedCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 md:px-8 py-4 bg-black sticky top-0 z-50 gap-4 border-b border-zinc-800">

        {/* Logo */}
        <h1 className="text-2xl md:text-3xl font-bold text-red-600 tracking-wide">
          CINEVERSE
        </h1>

        {/* Right */}
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">

          {/* Search */}
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="bg-zinc-900 px-4 py-3 rounded-xl outline-none w-full md:w-72 text-white border border-zinc-700 focus:border-red-600 transition"
          />

          {/* Theme */}
          <button
            onClick={() =>
              setDarkMode(
                !darkMode
              )
            }
            className={`px-4 py-3 rounded-xl cursor-pointer transition font-medium ${
              darkMode
                ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                : "bg-zinc-300 hover:bg-zinc-400 text-black"
            }`}
          >
            {darkMode
              ? "☀ Light"
              : "🌙 Dark"}
          </button>

          {/* User */}
          {user ? (

            <div className="relative">

              <button
                onClick={() =>
                  setShowMenu(
                    !showMenu
                  )
                }
                className="flex items-center gap-3 bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-700 hover:bg-zinc-800 transition"
              >

                <img
                  src={
                    user
                      ?.user_metadata
                      ?.avatar_url ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />

                <span className="hidden md:block font-medium">
                  {user
                    ?.user_metadata
                    ?.full_name ||
                    "Profile"}
                </span>

              </button>

              {showMenu && (

                <div className="absolute right-0 mt-3 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-64 overflow-hidden z-50">

                  <Link
                    href="/profile"
                    className="block px-6 py-4 hover:bg-zinc-800 transition"
                  >
                    👤 My Profile
                  </Link>

                  <Link
                    href="/profile"
                    className="block px-6 py-4 hover:bg-zinc-800 transition"
                  >
                    🕒 Watch History
                  </Link>

                  <Link
                    href="/profile"
                    className="block px-6 py-4 hover:bg-zinc-800 transition"
                  >
                    ❤️ Watchlist
                  </Link>

                  <Link
                    href="/profile"
                    className="block px-6 py-4 hover:bg-zinc-800 transition"
                  >
                    👍 Liked Movies
                  </Link>

                  <Link
                    href="/settings"
                    className="block px-6 py-4 hover:bg-zinc-800 transition"
                  >
                    ⚙ Settings
                  </Link>

                  <button
                    onClick={logout}
                    className="w-full text-left px-6 py-4 hover:bg-red-600 transition"
                  >
                    🚪 Logout
                  </button>

                </div>

              )}

            </div>

          ) : (

            <Link
              href="/login"
              className="bg-red-600 px-5 py-3 rounded-xl text-center hover:bg-red-700 transition text-white"
            >
              Login
            </Link>

          )}

        </div>

      </div>

      {/* Categories */}
      <div className="flex gap-3 px-4 md:px-8 py-5 overflow-x-auto scrollbar-hide">

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
              setSelectedCategory(
                category
              )
            }
            className={`px-5 py-2 rounded-full whitespace-nowrap cursor-pointer transition font-medium ${
              selectedCategory ===
              category
                ? "bg-red-600 text-white"
                : darkMode
                ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                : "bg-zinc-300 hover:bg-zinc-400 text-black"
            }`}
          >
            {category}
          </button>

        ))}

      </div>

      {/* Hero */}
      <div
        className="h-[60vh] md:h-[75vh] bg-cover bg-center flex items-end relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c')",
        }}
      >

        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 w-full p-6 md:p-10">

          <span className="bg-red-600 px-4 py-2 rounded-full text-sm font-medium">
            🔥 Trending Platform
          </span>

          <h1 className="text-4xl md:text-6xl font-bold mt-5 mb-4 text-white leading-tight">
            WATCH MOVIES ONLINE
          </h1>

          <p className="max-w-2xl text-gray-300 text-base md:text-lg mb-8 leading-8">
            Stream Bollywood,
            South Movies,
            Anime and Web Series
            online in HD quality
          </p>

          <button className="bg-red-600 px-8 py-3 rounded-xl text-lg cursor-pointer hover:bg-red-700 transition text-white font-semibold shadow-lg">
            ▶ Watch Now
          </button>

        </div>

      </div>

      {/* Movies */}
      <div className="p-4 md:p-8">

        <div className="flex items-center justify-between mb-8">

          <h2 className="text-3xl font-bold">
            Latest Movies
          </h2>

          <p className="text-gray-400 text-sm">
            {
              filteredMovies.length
            }{" "}
            Movies
          </p>

        </div>

        {filteredMovies.length ===
        0 ? (

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center">

            <h2 className="text-2xl font-bold mb-4">
              No movies found
            </h2>

            <p className="text-gray-400">
              Try another search
              or category.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">

            {filteredMovies.map(
              (movie) => (

                <div
                  key={movie.id}
                  className={`rounded-2xl overflow-hidden hover:scale-105 transition duration-300 shadow-lg border ${
                    darkMode
                      ? "bg-zinc-900 border-zinc-800"
                      : "bg-zinc-200 border-zinc-300"
                  }`}
                >

                  {/* Thumbnail */}
                  <div className="relative">

                    <img
                      src={
                        movie.thumbnail ||
                        "https://via.placeholder.com/400x600?text=No+Image"
                      }
                      alt={
                        movie.title
                      }
                      className="w-full h-72 object-cover"
                    />

                    <span className="absolute top-3 right-3 bg-red-600 text-white text-xs px-2 py-1 rounded-md">
                      HD
                    </span>

                  </div>

                  {/* Content */}
                  <div className="p-4">

                    <h3 className="text-lg md:text-xl font-semibold line-clamp-1">
                      {movie.title}
                    </h3>

                    <p className="text-gray-400 mt-2">
                      🎬{" "}
                      {
                        movie.category
                      }
                    </p>

                    <div className="flex items-center justify-between mt-3">

                      <p className="text-gray-500 text-sm">
                        👁{" "}
                        {movie.views ||
                          0}{" "}
                        views
                      </p>

                      <div className="text-yellow-400 text-sm">
                        ⭐ 5.0
                      </div>

                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">

                      <span className="bg-zinc-800 text-gray-300 text-xs px-3 py-1 rounded-full">
                        Trending
                      </span>

                      <span className="bg-zinc-800 text-gray-300 text-xs px-3 py-1 rounded-full">
                        Fast Stream
                      </span>

                    </div>

                    <div className="flex gap-2 mt-5">

                      <Link
                        href={`/movie/${movie.id}`}
                        className="flex-1 bg-red-600 py-2 rounded-xl text-center cursor-pointer hover:bg-red-700 transition text-white font-medium"
                      >
                        ▶ Watch
                      </Link>

                      <a
                        href={
                          movie.drive_link
                        }
                        target="_blank"
                        className={`flex-1 py-2 rounded-xl text-center cursor-pointer transition font-medium ${
                          darkMode
                            ? "bg-zinc-700 hover:bg-zinc-600 text-white"
                            : "bg-zinc-400 hover:bg-zinc-500 text-black"
                        }`}
                      >
                        ⬇ Download
                      </a>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

      {/* Footer */}
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
                Watch Bollywood,
                South Movies,
                Anime and Web Series
                online
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
              © 2026 CINEVERSE.
              All Rights Reserved.
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