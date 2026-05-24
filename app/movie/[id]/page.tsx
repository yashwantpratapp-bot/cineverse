"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import WatchlistButton from "./watchlist-button";

export default function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const [movie, setMovie] =
    useState<any>(null);

  const [relatedMovies, setRelatedMovies] =
    useState<any[]>([]);

  useEffect(() => {

    const fetchMovie = async () => {

      const { id } = await params;

      const { data } = await supabase
        .from("movies")
        .select("*")
        .eq("id", id)
        .single();

      setMovie(data);

      // Related Movies
      const { data: related } =
        await supabase
          .from("movies")
          .select("*")
          .eq("category", data.category)
          .neq("id", data.id)
          .limit(4);

      setRelatedMovies(related || []);
    };

    fetchMovie();

  }, [params]);

  if (!movie) {

    return (
      <main className="bg-black min-h-screen text-white flex items-center justify-center">

        <h1 className="text-4xl font-bold animate-pulse">
          Loading...
        </h1>

      </main>
    );
  }

  return (
    <main className="bg-black min-h-screen text-white">

      {/* Navbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 md:px-8 py-4 bg-black border-b border-zinc-800 sticky top-0 z-50 gap-4">

        <Link
          href="/"
          className="text-2xl md:text-3xl font-bold text-red-600"
        >
          CINEVERSE
        </Link>

        <Link
          href="/profile"
          className="bg-zinc-800 px-5 py-3 rounded-lg hover:bg-zinc-700 transition text-center"
        >
          Profile
        </Link>

      </div>

      {/* Banner */}
      <div
        className="h-[45vh] md:h-[70vh] bg-cover bg-center flex items-end"
        style={{
          backgroundImage: `url(${movie.thumbnail})`,
        }}
      >

        <div className="bg-gradient-to-t from-black via-black/70 to-transparent w-full p-6 md:p-10">

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {movie.title}
          </h1>

          <p className="text-gray-300 text-lg">
            {movie.category}
          </p>

        </div>

      </div>

      {/* Player */}
      <div className="p-4 md:p-10">

        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Watch Movie
        </h2>

        {/* Video */}
        <div className="mt-6 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">

          <iframe
            src={movie.drive_link}
            width="100%"
            height="700"
            allow="autoplay"
            allowFullScreen
            className="rounded-2xl"
          ></iframe>

        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6 flex-wrap">

          <a
            href={movie.drive_link}
            target="_blank"
            className="bg-zinc-800 hover:bg-zinc-700 transition px-8 py-3 rounded-lg cursor-pointer"
          >
            ⬇ Download
          </a>

          <WatchlistButton movieId={movie.id} />

        </div>

      </div>

      {/* About */}
      <div className="px-4 md:px-10 pb-14">

        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          About Movie
        </h2>

        <p className="text-gray-400 leading-8 max-w-4xl">
          Watch {movie.title} full movie online in HD quality.
          Stream Bollywood, South Indian and Web Series
          movies on CINEVERSE 😄🔥
        </p>

      </div>

      {/* Related Movies */}
      <div className="p-4 md:p-10">

        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          You May Also Like
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">

          {relatedMovies.map((item) => (

            <Link
              href={`/movie/${item.id}`}
              key={item.id}
              className="bg-zinc-900 rounded-xl overflow-hidden hover:scale-105 transition duration-300 block"
            >

              <img
                src={
                  item.thumbnail ||
                  "https://via.placeholder.com/400x600?text=No+Image"
                }
                alt={item.title}
                className="w-full h-72 object-cover"
              />

              <div className="p-4">

                <h3 className="text-lg md:text-xl font-semibold">
                  {item.title}
                </h3>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </main>
  );
}