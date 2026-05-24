"use client";

import { supabase } from "@/lib/supabase";

export default function WatchlistButton({
  movieId,
}: {
  movieId: number;
}) {

  const addToWatchlist = async () => {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Login first 😄");
      return;
    }

    const { error } = await supabase
      .from("watchlist")
      .insert([
        {
          user_email: user.email,
          movie_id: movieId,
        },
      ]);

    if (error) {
      alert(error.message);
    } else {
      alert("Added To Watchlist 😄");
    }
  };

  return (
    <button
      onClick={addToWatchlist}
      className="bg-red-600 px-8 py-3 rounded-lg cursor-pointer hover:bg-red-700 transition"
    >
      ❤️ Add To Watchlist
    </button>
  );
}