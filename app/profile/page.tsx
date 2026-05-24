"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {

  const [user, setUser] = useState<any>(null);

  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {

    const fetchData = async () => {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUser(user);

      // WATCHLIST
      const { data: watchlistData } = await supabase
        .from("watchlist")
        .select("*")
        .eq("user_email", user.email);

      console.log(watchlistData);

      // ALL MOVIES
      const { data: allMovies } = await supabase
        .from("movies")
        .select("*");

      console.log(allMovies);

      if (!watchlistData || !allMovies) return;

      // MATCH
      const matchedMovies = allMovies.filter((movie) =>
        watchlistData.some(
          (item) => item.movie_id === movie.id
        )
      );

      console.log(matchedMovies);

      setMovies(matchedMovies);
    };

    fetchData();

  }, []);

  return (
    <main className="bg-black min-h-screen text-white p-10">

      <div className="flex items-center justify-between mb-10">

        <div>

          <h1 className="text-5xl font-bold text-red-600 mb-4">
            My Profile
          </h1>

          <p className="text-gray-400">
            {user?.email}
          </p>

        </div>

        <Link
          href="/"
          className="bg-red-600 px-6 py-3 rounded-lg"
        >
          Home
        </Link>

      </div>

      <h2 className="text-3xl font-bold mb-6">
        ❤️ My Watchlist
      </h2>

      {movies.length === 0 ? (

        <p className="text-gray-400">
          No movies in watchlist 😄
        </p>

      ) : (

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {movies.map((movie) => (

            <Link
              href={`/movie/${movie.id}`}
              key={movie.id}
              className="bg-zinc-900 rounded-xl overflow-hidden hover:scale-105 transition duration-300 block"
            >

              <img
                src={movie.thumbnail}
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

              </div>

            </Link>

          ))}

        </div>

      )}

    </main>
  );
}