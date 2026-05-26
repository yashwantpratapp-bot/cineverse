"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {

  const [title, setTitle] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [thumbnail, setThumbnail] =
    useState("");

  const [driveLink, setDriveLink] =
    useState("");

  const [movies, setMovies] =
    useState<any[]>([]);

  const [series, setSeries] =
    useState<any[]>([]);

  const [requests, setRequests] =
    useState<any[]>([]);

  const [activeTab, setActiveTab] =
    useState("movies");

  const [selectedSeries, setSelectedSeries] =
    useState("");

  const [seriesTitle, setSeriesTitle] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [authorized, setAuthorized] =
    useState(false);

  const [editId, setEditId] =
    useState<number | null>(null);

  const [season, setSeason] =
    useState("");

  const [episode, setEpisode] =
    useState("");

  useEffect(() => {

    const checkAdmin = async () => {

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (
        user?.email ===
        "yashwantpratapp@gmail.com"
      ) {

        setAuthorized(true);

        await fetchMovies();

        await fetchSeries();

        await fetchRequests();
      }

      setLoading(false);
    };

    checkAdmin();

  }, []);

  // FETCH MOVIES
  const fetchMovies = async () => {

    const { data, error } =
      await supabase
        .from("movies")
        .select("*")
        .order("id", {
          ascending: false,
        });

    if (error) {
      console.log(error);
      return;
    }

    setMovies(data || []);
  };

  // FETCH SERIES
  const fetchSeries = async () => {

    const { data, error } =
      await supabase
        .from("series")
        .select("*")
        .order("title", {
          ascending: true,
        });

    if (error) {
      console.log(error);
      return;
    }

    setSeries(data || []);
  };

  // FETCH REQUESTS
  const fetchRequests =
    async () => {

      const { data } =
        await supabase
          .from(
            "movie_requests"
          )
          .select("*")
          .order(
            "created_at",
            {
              ascending:
                false,
            }
          );

      setRequests(
        data || []
      );
    };

  // UPDATE REQUEST
  const updateRequestStatus =
  async (
    id: number,
    status: string
  ) => {

    const request = requests.find(
      (req) => req.id === id
    );

    // SEND NOTIFICATION
    if (request) {
await fetch("/api/send-email", {

  method: "POST",

  headers: {
    "Content-Type":
      "application/json",
  },

  body: JSON.stringify({

    email: request.user_email,

    title:
      status === "approved"
        ? "🎉 Request Approved"
        : "❌ Request Declined",

    message:
      status === "approved"
        ? `${request.movie_name} is now available on Cineverse 😄🔥`
        : `${request.movie_name} request was declined 😔`,
  }),
});
      await supabase
        .from("notifications")
        .insert([
          {
            user_email:
              request.user_email,

            title:
              status === "approved"
                ? "🎉 Request Approved"
                : "❌ Request Declined",

            message:
              status === "approved"
                ? `${request.movie_name} is now available 😄🔥`
                : `${request.movie_name} request was declined`,
          },
        ]);
    }

    // DELETE REQUEST
    await supabase
      .from("movie_requests")
      .delete()
      .eq("id", id);

    // REFRESH
    fetchRequests();
  };

  // ADD SERIES
  const addSeries = async () => {

    if (
      !seriesTitle ||
      !thumbnail ||
      !category
    ) {

      alert(
        "Fill all fields"
      );

      return;
    }

    const {
      data,
      error,
    } = await supabase
      .from("series")
      .insert([
        {
          title:
            seriesTitle,
          thumbnail,
          category,
        },
      ])
      .select();

    if (error) {

      alert(error.message);

      return;
    }

    alert(
      "Series Added"
    );

    setSelectedSeries(
      String(data[0].id)
    );

    setSeriesTitle("");

    setSeason("");

    setEpisode("");

    await fetchSeries();
  };

  // EDIT MOVIE
  const editMovie = (
    movie: any
  ) => {

    setEditId(movie.id);

    setTitle(movie.title);

    setCategory(movie.category);

    setThumbnail(
      movie.thumbnail
    );

    setDriveLink(
      movie.drive_link
    );

    setSeason(
      movie.season || ""
    );

    setEpisode(
      movie.episode || ""
    );

    setSelectedSeries(
      movie.series_id
        ? String(
            movie.series_id
          )
        : ""
    );
  };

  // RESET
  const resetForm = () => {

    setEditId(null);

    setTitle("");

    setCategory("");

    setThumbnail("");

    setDriveLink("");

    setSeason("");

    setEpisode("");

    setSelectedSeries("");
  };

  // ADD / UPDATE
  const addMovie = async () => {

    if (
      !category ||
      !thumbnail ||
      !driveLink
    ) {

      alert(
        "Fill all fields"
      );

      return;
    }

    let finalTitle =
      title;

    if (
      selectedSeries
    ) {

      if (
        !season ||
        !episode
      ) {

        alert(
          "Add season and episode"
        );

        return;
      }

      const selected =
        series.find(
          (item) =>
            Number(item.id) ===
            Number(
              selectedSeries
            )
        );

      if (!selected) {

        alert(
          "Series not found"
        );

        return;
      }

      finalTitle =
        `${selected.title} - Season ${season} Episode ${episode}`;
    }

    if (
      !selectedSeries &&
      !title
    ) {

      alert(
        "Enter movie title"
      );

      return;
    }

    // UPDATE
    if (editId) {

      const { error } =
        await supabase
          .from("movies")
          .update({
            title:
              finalTitle,
            category,
            thumbnail,
            drive_link:
              driveLink,
            season:
              season || null,
            episode:
              episode || null,
            series_id:
              selectedSeries
                ? Number(
                    selectedSeries
                  )
                : null,
          })
          .eq(
            "id",
            editId
          );

      if (error) {

        alert(
          error.message
        );

        return;
      }

      alert(
        "Movie Updated"
      );

      resetForm();

      fetchMovies();

      return;
    }

    // ADD
    const { error } =
      await supabase
        .from("movies")
        .insert([
          {
            title:
              finalTitle,
            category,
            thumbnail,
            drive_link:
              driveLink,
            season:
              season || null,
            episode:
              episode || null,
            series_id:
              selectedSeries
                ? Number(
                    selectedSeries
                  )
                : null,
          },
        ]);

    if (error) {

      alert(error.message);

      return;
    }

    alert(
      "Movie Added"
    );

    resetForm();

    fetchMovies();
  };

  // DELETE
  const deleteMovie =
    async (
      id: number
    ) => {

      const confirmDelete =
        confirm(
          "Delete this movie?"
        );

      if (!confirmDelete)
        return;

      await supabase
        .from("movies")
        .delete()
        .eq("id", id);

      alert(
        "Movie Deleted"
      );

      fetchMovies();
    };

  // LOADING
  if (loading) {

    return (
      <main className="bg-black text-white min-h-screen flex items-center justify-center">

        <h1 className="text-4xl font-bold animate-pulse">
          Loading...
        </h1>

      </main>
    );
  }

  // UNAUTHORIZED
  if (!authorized) {

    return (
      <main className="bg-black text-white min-h-screen flex items-center justify-center px-4">

        <div className="bg-zinc-900 p-10 rounded-2xl text-center max-w-md w-full border border-red-600">

          <h1 className="text-5xl mb-4">
            ❌
          </h1>

          <h2 className="text-3xl font-bold text-red-600 mb-4">
            Access Denied
          </h2>

          <p className="text-gray-400 leading-7">
            You are not authorized
            to access admin panel
          </p>

        </div>

      </main>
    );
  }

  return (
    <main className="bg-black min-h-screen text-white px-4 py-10">

      <div className="max-w-7xl mx-auto">

        {/* TOP NAV */}
        <div className="flex gap-4 mb-10">

          <button
            onClick={() =>
              setActiveTab(
                "movies"
              )
            }
            className={`px-6 py-3 rounded-xl font-bold transition ${
              activeTab ===
              "movies"
                ? "bg-red-600"
                : "bg-zinc-800"
            }`}
          >
            🎬 Movies
          </button>

          <button
            onClick={() =>
              setActiveTab(
                "requests"
              )
            }
            className={`px-6 py-3 rounded-xl font-bold transition ${
              activeTab ===
              "requests"
                ? "bg-red-600"
                : "bg-zinc-800"
            }`}
          >
            📩 Requests
          </button>

        </div>

        {/* MOVIES TAB */}
        {activeTab ===
          "movies" && (

          <>
            {/* FORM */}
            <div className="bg-zinc-900 p-10 rounded-2xl border border-zinc-800 shadow-2xl">

              <div className="text-center mb-10">

                <h1 className="text-5xl font-bold text-red-600 mb-4">
                  CINEVERSE ADMIN
                </h1>

                <p className="text-gray-400">
                  Upload and manage movies
                </p>

              </div>

              <div className="space-y-6">

                <div className="bg-black p-6 rounded-2xl border border-zinc-800">

                  <h2 className="text-2xl font-bold mb-4">
                    📺 Create New Series
                  </h2>

                  <input
                    type="text"
                    placeholder="Series Title"
                    value={seriesTitle}
                    onChange={(e) =>
                      setSeriesTitle(
                        e.target.value
                      )
                    }
                    className="w-full bg-zinc-900 p-4 rounded-xl outline-none border border-zinc-700"
                  />

                  <button
                    onClick={
                      addSeries
                    }
                    className="mt-4 bg-blue-600 px-6 py-3 rounded-xl"
                  >
                    ➕ Add Series
                  </button>

                </div>

                <input
                  type="text"
                  placeholder="Movie Title"
                  value={title}
                  onChange={(e) =>
                    setTitle(
                      e.target.value
                    )
                  }
                  className="w-full bg-black p-4 rounded-xl outline-none border border-zinc-800"
                />

                <input
                  type="text"
                  placeholder="Thumbnail URL"
                  value={thumbnail}
                  onChange={(e) =>
                    setThumbnail(
                      e.target.value
                    )
                  }
                  className="w-full bg-black p-4 rounded-xl outline-none border border-zinc-800"
                />

                <input
                  type="text"
                  placeholder="Drive / Embed Link"
                  value={driveLink}
                  onChange={(e) =>
                    setDriveLink(
                      e.target.value
                    )
                  }
                  className="w-full bg-black p-4 rounded-xl outline-none border border-zinc-800"
                />

                <button
                  onClick={
                    addMovie
                  }
                  className="w-full bg-red-600 py-4 rounded-xl text-xl font-semibold"
                >
                  {editId
                    ? "✏ Update Movie"
                    : "🎬 Publish"}
                </button>

              </div>

            </div>

            {/* MOVIES */}
            <div className="mt-14">

              <h2 className="text-4xl font-bold mb-8">
                Uploaded Movies
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

                {movies.map(
                  (movie) => (

                    <div
                      key={movie.id}
                      className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800"
                    >

                      <img
                        src={
                          movie.thumbnail
                        }
                        alt={
                          movie.title
                        }
                        className="w-full h-72 object-cover"
                      />

                      <div className="p-4">

                        <h3 className="text-xl font-bold line-clamp-2">
                          {movie.title}
                        </h3>

                        <p className="text-gray-400 mt-2">
                          {movie.category}
                        </p>

                        <button
                          onClick={() =>
                            editMovie(
                              movie
                            )
                          }
                          className="mt-4 w-full bg-blue-600 py-3 rounded-xl"
                        >
                          ✏ Edit
                        </button>

                        <button
                          onClick={() =>
                            deleteMovie(
                              movie.id
                            )
                          }
                          className="mt-3 w-full bg-red-600 py-3 rounded-xl"
                        >
                          🗑 Delete
                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>
          </>

        )}

        {/* REQUESTS TAB */}
        {activeTab ===
          "requests" && (

          <div className="mt-14">

            <h2 className="text-4xl font-bold mb-8">
              📩 Movie Requests
            </h2>

            <div className="space-y-6">

              {requests.map(
                (req) => (

                  <div
                    key={req.id}
                    className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800"
                  >

                    <div className="flex justify-between items-start gap-6 flex-wrap">

                      <div>

                        <h3 className="text-2xl font-bold">
                          {req.movie_name}
                        </h3>

                        <p className="text-gray-400 mt-2">
                          {req.user_email}
                        </p>

                        <p className="text-gray-300 mt-4">
                          {req.message}
                        </p>

                      </div>

                      <div className="flex gap-4">

                        <button
                          onClick={() =>
                            updateRequestStatus(
                              req.id,
                              "approved"
                            )
                          }
                          className="bg-green-600 px-5 py-3 rounded-lg"
                        >
                          ✅ Approve
                        </button>

                        <button
                          onClick={() =>
                            updateRequestStatus(
                              req.id,
                              "declined"
                            )
                          }
                          className="bg-red-600 px-5 py-3 rounded-lg"
                        >
                          ❌ Decline
                        </button>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        )}

      </div>

    </main>
  );
}