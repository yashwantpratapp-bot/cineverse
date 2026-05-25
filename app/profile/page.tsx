"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {

  const [user, setUser] =
    useState<any>(null);

  const [movies, setMovies] =
    useState<any[]>([]);

  const [watchHistory, setWatchHistory] =
    useState<any[]>([]);

  const [likedMovies, setLikedMovies] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchData = async () => {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {

        setLoading(false);

        return;
      }

      setUser(user);

      // WATCHLIST
      const { data: watchlistData } =
        await supabase
          .from("watchlist")
          .select("*")
          .eq("user_email", user.email);

      // ALL MOVIES
      const { data: allMovies } =
        await supabase
          .from("movies")
          .select("*");

      if (!allMovies) {

        setLoading(false);

        return;
      }

      // WATCHLIST MOVIES
      if (watchlistData) {

        const matchedMovies =
          allMovies.filter((movie) =>

            watchlistData.some(
              (item) =>
                Number(item.movie_id) ===
                Number(movie.id)
            )
          );

        setMovies(matchedMovies);
      }

      // WATCH HISTORY
      const { data: historyData } =
        await supabase
          .from("watch_history")
          .select("*")
          .eq("user_email", user.email)
          .order("created_at", {
            ascending: false,
          });

      if (historyData) {

        const historyIds = [
          ...new Set(
            historyData.map(
              (item) =>
                Number(item.movie_id)
            )
          ),
        ];

        if (
          historyIds.length > 0
        ) {

          const {
            data: historyMovies,
          } = await supabase
            .from("movies")
            .select("*")
            .in("id", historyIds);

          setWatchHistory(
            historyMovies || []
          );
        }
      }

      // LIKED MOVIES
      const { data: likedData } =
        await supabase
          .from("movie_likes")
          .select("*")
          .eq(
            "user_email",
            user.email
          )
          .eq("type", "like");

      if (likedData) {

        const likedIds = [
          ...new Set(
            likedData.map(
              (item) =>
                Number(item.movie_id)
            )
          ),
        ];

        if (
          likedIds.length > 0
        ) {

          const {
            data: likedMoviesData,
          } = await supabase
            .from("movies")
            .select("*")
            .in("id", likedIds);

          setLikedMovies(
            likedMoviesData || []
          );
        }
      }

      setLoading(false);
    };

    fetchData();

  }, []);

  // Loading
  if (loading) {

    return (
      <main className="bg-black min-h-screen text-white flex items-center justify-center">

        <h1 className="text-4xl font-bold animate-pulse">
          Loading...
        </h1>

      </main>
    );
  }

  return (
    <main className="bg-black min-h-screen text-white p-4 md:p-10">

      {/* Top */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">

        <div>

          <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-4">
            My Profile
          </h1>

          <p className="text-gray-400 break-all">
            {user?.email}
          </p>

        </div>

        <Link
          href="/"
          className="bg-red-600 px-6 py-3 rounded-lg hover:bg-red-700 transition text-center"
        >
          Home
        </Link>

      </div>

      {/* Watch History */}
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        🕒 Watch History
      </h2>

      {watchHistory.length === 0 ? (

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center mb-12">

          <h2 className="text-2xl font-bold mb-4">
            No watch history
          </h2>

          <p className="text-gray-400">
            Start watching movies
            to see history here.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-14">

          {watchHistory.map((movie) => (

            <Link
              href={`/movie/${movie.id}`}
              key={movie.id}
              className="bg-zinc-900 rounded-2xl overflow-hidden hover:scale-105 transition duration-300 block border border-zinc-800"
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

                <h3 className="text-lg md:text-xl font-semibold">
                  {movie.title}
                </h3>

                <p className="text-gray-400 mt-2">
                  {movie.category}
                </p>

              </div>

            </Link>

          ))}

        </div>

      )}

      {/* Liked Movies */}
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        👍 Liked Movies
      </h2>

      {likedMovies.length === 0 ? (

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center mb-12">

          <h2 className="text-2xl font-bold mb-4">
            No liked movies
          </h2>

          <p className="text-gray-400">
            Like movies to see them
            here.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-14">

          {likedMovies.map((movie) => (

            <Link
              href={`/movie/${movie.id}`}
              key={movie.id}
              className="bg-zinc-900 rounded-2xl overflow-hidden hover:scale-105 transition duration-300 block border border-zinc-800"
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

                <h3 className="text-lg md:text-xl font-semibold">
                  {movie.title}
                </h3>

                <p className="text-gray-400 mt-2">
                  {movie.category}
                </p>

              </div>

            </Link>

          ))}

        </div>

      )}

      {/* Watchlist */}
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        ❤️ My Watchlist
      </h2>

      {movies.length === 0 ? (

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center">

          <h2 className="text-2xl font-bold mb-4">
            No movies in watchlist
          </h2>

          <p className="text-gray-400">
            Add movies to your
            watchlist to see them
            here.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">

          {movies.map((movie) => (

            <Link
              href={`/movie/${movie.id}`}
              key={movie.id}
              className="bg-zinc-900 rounded-2xl overflow-hidden hover:scale-105 transition duration-300 block border border-zinc-800"
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

                <h3 className="text-lg md:text-xl font-semibold">
                  {movie.title}
                </h3>

                <p className="text-gray-400 mt-2">
                  {movie.category}
                </p>

                <p className="text-red-500 mt-3 text-sm">
                  👁 {movie.views || 0} views
                </p>

              </div>

            </Link>

          ))}

        </div>

      )}

    </main>
  );
}