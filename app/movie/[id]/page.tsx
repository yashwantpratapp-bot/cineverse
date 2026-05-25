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

  const [likes, setLikes] =
    useState(0);

  const [dislikes, setDislikes] =
    useState(0);

  const [comment, setComment] =
    useState("");

  const [comments, setComments] =
    useState<any[]>([]);

  useEffect(() => {

    const fetchMovie = async () => {

      const { id } =
        await params;

      const { data } =
        await supabase
          .from("movies")
          .select("*")
          .eq("id", id)
          .single();

      setMovie(data);

      // SAVE WATCH HISTORY
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (user) {

        // CHECK ALREADY EXISTS
        const {
          data: existingHistory,
        } = await supabase
          .from("watch_history")
          .select("*")
          .eq(
            "user_email",
            user.email
          )
          .eq(
            "movie_id",
            data.id
          )
          .single();

        // INSERT ONLY IF NOT EXISTS
        if (!existingHistory) {

          await supabase
            .from("watch_history")
            .insert([
              {
                user_email:
                  user.email,
                movie_id:
                  data.id,
              },
            ]);
        }
      }

      // RELATED MOVIES
      const {
        data: related,
      } =
        await supabase
          .from("movies")
          .select("*")
          .eq(
            "category",
            data.category
          )
          .neq("id", data.id)
          .limit(4);

      setRelatedMovies(
        related || []
      );

      // LIKES
      const {
        data: likeData,
      } =
        await supabase
          .from("movie_likes")
          .select("*")
          .eq(
            "movie_id",
            data.id
          )
          .eq("type", "like");

      // DISLIKES
      const {
        data: dislikeData,
      } =
        await supabase
          .from("movie_likes")
          .select("*")
          .eq(
            "movie_id",
            data.id
          )
          .eq(
            "type",
            "dislike"
          );

      setLikes(
        likeData?.length || 0
      );

      setDislikes(
        dislikeData?.length || 0
      );

      // COMMENTS
      const {
        data: commentData,
      } =
        await supabase
          .from("comments")
          .select("*")
          .eq(
            "movie_id",
            data.id
          )
          .order(
            "created_at",
            {
              ascending:
                false,
            }
          );

      setComments(
        commentData || []
      );
    };

    fetchMovie();

  }, [params]);

  // LIKE / DISLIKE
  const reactToMovie =
    async (
      type:
        | "like"
        | "dislike"
    ) => {

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {

        alert(
          "Login first"
        );

        return;
      }

      // CHECK EXISTING
      const {
        data:
          existingReaction,
      } =
        await supabase
          .from(
            "movie_likes"
          )
          .select("*")
          .eq(
            "user_email",
            user.email
          )
          .eq(
            "movie_id",
            movie.id
          )
          .single();

      // SAME REACTION
      if (
        existingReaction &&
        existingReaction.type ===
          type
      ) {

        alert(
          `Already ${type}d`
        );

        return;
      }

      // REMOVE OLD REACTION
      if (
        existingReaction
      ) {

        await supabase
          .from(
            "movie_likes"
          )
          .delete()
          .eq(
            "id",
            existingReaction.id
          );

        if (
          existingReaction.type ===
          "like"
        ) {

          setLikes(
            (prev) =>
              prev - 1
          );

        } else {

          setDislikes(
            (prev) =>
              prev - 1
          );
        }
      }

      // INSERT NEW
      await supabase
        .from(
          "movie_likes"
        )
        .insert([
          {
            user_email:
              user.email,
            movie_id:
              movie.id,
            type,
          },
        ]);

      // UPDATE UI
      if (
        type === "like"
      ) {

        setLikes(
          (prev) =>
            prev + 1
        );

      } else {

        setDislikes(
          (prev) =>
            prev + 1
        );
      }
    };

  // ADD COMMENT
  const addComment =
    async () => {

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {

        alert(
          "Login first"
        );

        return;
      }

      if (
        !comment.trim()
      )
        return;

      const { data } =
        await supabase
          .from("comments")
          .insert([
            {
              user_email:
                user.email,

              user_name:
                user
                  .user_metadata
                  ?.full_name ||
                user.email,

              user_avatar:
                user
                  .user_metadata
                  ?.avatar_url,

              movie_id:
                movie.id,

              comment,
            },
          ])
          .select();

      if (data) {

        setComments([
          data[0],
          ...comments,
        ]);

        setComment("");
      }
    };

  // LOADING
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

      {/* NAVBAR */}
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

      {/* BANNER */}
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

      {/* PLAYER */}
      <div className="p-4 md:p-10">

        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Watch Movie
        </h2>

        {/* VIDEO */}
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

        {/* LIKE DISLIKE */}
        <div className="flex gap-4 mt-6">

          <button
            onClick={() =>
              reactToMovie(
                "like"
              )
            }
            className="bg-zinc-900 px-6 py-3 rounded-lg hover:bg-zinc-700 transition"
          >
            👍 {likes}
          </button>

          <button
            onClick={() =>
              reactToMovie(
                "dislike"
              )
            }
            className="bg-zinc-900 px-6 py-3 rounded-lg hover:bg-zinc-700 transition"
          >
            👎{" "}
            {dislikes}
          </button>

        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 mt-6 flex-wrap">

          <a
            href={
              movie.drive_link
            }
            target="_blank"
            className="bg-zinc-800 hover:bg-zinc-700 transition px-8 py-3 rounded-lg cursor-pointer"
          >
            ⬇ Download
          </a>

          <WatchlistButton
            movieId={
              movie.id
            }
          />

        </div>

      </div>

      {/* ABOUT */}
      <div className="px-4 md:px-10 pb-14">

        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          About Movie
        </h2>

        <p className="text-gray-400 leading-8 max-w-4xl">
          Watch{" "}
          {movie.title}{" "}
          full movie online
          in HD quality.
          Stream Bollywood,
          South Indian and
          Web Series movies
          on CINEVERSE.
        </p>

      </div>

      {/* RELATED */}
      <div className="p-4 md:p-10">

        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          You May Also Like
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">

          {relatedMovies.map(
            (item) => (

              <Link
                href={`/movie/${item.id}`}
                key={
                  item.id
                }
                className="bg-zinc-900 rounded-xl overflow-hidden hover:scale-105 transition duration-300 block"
              >

                <img
                  src={
                    item.thumbnail ||
                    "https://via.placeholder.com/400x600?text=No+Image"
                  }
                  alt={
                    item.title
                  }
                  className="w-full h-72 object-cover"
                />

                <div className="p-4">

                  <h3 className="text-lg md:text-xl font-semibold">
                    {
                      item.title
                    }
                  </h3>

                </div>

              </Link>

            )
          )}

        </div>

      </div>

      {/* COMMENTS */}
      <div className="p-4 md:p-10">

        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          💬 Comments
        </h2>

        {/* INPUT */}
        <div className="bg-zinc-900 p-6 rounded-xl mb-8">

          <textarea
            placeholder="Write your comment..."
            value={
              comment
            }
            onChange={(e) =>
              setComment(
                e.target.value
              )
            }
            className="w-full bg-black p-4 rounded-lg min-h-[120px] outline-none"
          />

          <button
            onClick={
              addComment
            }
            className="mt-4 bg-red-600 px-6 py-3 rounded-lg hover:bg-red-700 transition"
          >
            Post Comment
          </button>

        </div>

        {/* COMMENT LIST */}
        <div className="space-y-6">

          {comments.map(
            (item) => (

              <div
                key={item.id}
                className="bg-zinc-900 p-6 rounded-xl"
              >

                <div className="flex items-center gap-4 mb-4">

                  <img
                    src={
                      item.user_avatar ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt="User"
                    className="w-12 h-12 rounded-full"
                  />

                  <div>

                    <h3 className="font-bold">
                      {
                        item.user_name
                      }
                    </h3>

                    <p className="text-gray-400 text-sm">
                      {new Date(
                        item.created_at
                      ).toLocaleString()}
                    </p>

                  </div>

                </div>

                <p className="text-gray-300 leading-7">
                  {
                    item.comment
                  }
                </p>

              </div>

            )
          )}

        </div>

      </div>

    </main>
  );
}