import Link from "next/link";
import { supabase } from "@/lib/supabase";
import WatchlistButton from "./watchlist-button";

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  const { data: movie } = await supabase
    .from("movies")
    .select("*")
    .eq("id", id)
    .single();

  if (!movie) {
    return (
      <main className="bg-black min-h-screen text-white flex items-center justify-center">
        <h1 className="text-4xl">
          Movie not found 😄
        </h1>
      </main>
    );
  }

  return (
    <main className="bg-black min-h-screen text-white">

      {/* Navbar */}
      <div className="flex items-center justify-between px-8 py-4 bg-black">

        <Link
          href="/"
          className="text-3xl font-bold text-red-600"
        >
          CINEVERSE
        </Link>

      </div>

      {/* Banner */}
      <div
        className="h-[70vh] bg-cover bg-center flex items-end"
        style={{
          backgroundImage: `url(${movie.thumbnail})`,
        }}
      >
        <div className="bg-gradient-to-t from-black w-full p-10">

          <h1 className="text-6xl font-bold mb-4">
            {movie.title}
          </h1>

          <p className="text-gray-300 text-lg">
            {movie.category}
          </p>

        </div>

      </div>

      {/* Player */}
      <div className="p-10">

        <iframe
          src={movie.drive_link}
          width="100%"
          height="600"
          allow="autoplay"
          className="rounded-xl"
        ></iframe>

        <div className="flex gap-4 mt-6 flex-wrap">

          <a
            href={movie.drive_link}
            target="_blank"
            className="bg-zinc-800 px-8 py-3 rounded-lg"
          >
            ⬇ Download
          </a>

          <WatchlistButton movieId={movie.id} />

        </div>

      </div>

    </main>
  );
}