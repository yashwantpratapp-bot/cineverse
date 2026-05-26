"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [title, setTitle] = useState("");

  const [category, setCategory] = useState("");

  const [thumbnail, setThumbnail] = useState("");

  const [driveLink, setDriveLink] = useState("");

  const [movies, setMovies] = useState<any[]>([]);

  const [series, setSeries] = useState<any[]>([]);

  const [selectedSeries, setSelectedSeries] = useState("");

  const [seriesTitle, setSeriesTitle] = useState("");

  const [loading, setLoading] = useState(true);

  const [authorized, setAuthorized] = useState(false);

  // EDIT MODE
  const [editId, setEditId] = useState<number | null>(null);

  // SERIES
  const [season, setSeason] = useState("");

  const [episode, setEpisode] = useState("");

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email === "yashwantpratapp@gmail.com") {
        setAuthorized(true);

        await fetchMovies();

        await fetchSeries();
      }

      setLoading(false);
    };

    checkAdmin();
  }, []);

  // FETCH MOVIES
  const fetchMovies = async () => {
    const { data, error } = await supabase
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
    const { data, error } = await supabase
      .from("series")
      .select("*")
      .order("title", {
        ascending: true,
      });

    console.log("SERIES DATA:", data);

    console.log("SERIES ERROR:", error);

    if (error) {
      console.log(error);

      return;
    }

    setSeries(data || []);
  };

  // ADD SERIES
  const addSeries = async () => {
    if (!seriesTitle || !thumbnail || !category) {
      alert("Fill all fields");

      return;
    }

    const { data, error } = await supabase
      .from("series")
      .insert([
        {
          title: seriesTitle,
          thumbnail,
          category,
        },
      ])
      .select();

    console.log(data);

    console.log(error);

    if (error) {
      alert(error.message);

      return;
    }

    alert("Series Added");

    setSelectedSeries(String(data[0].id));

    setSeriesTitle("");

    setSeason("");

    setEpisode("");

    await fetchSeries();
  };

  // EDIT MOVIE
  const editMovie = (movie: any) => {
    setEditId(movie.id);

    setTitle(movie.title);

    setCategory(movie.category);

    setThumbnail(movie.thumbnail);

    setDriveLink(movie.drive_link);

    setSeason(movie.season || "");

    setEpisode(movie.episode || "");

    setSelectedSeries(movie.series_id ? String(movie.series_id) : "");
  };
  // AUTO CONVERT LINK
  const convertToPreviewLink = (url: string) => {
    // YOUTUBE SHORT URL
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];

      return `https://www.youtube.com/embed/${videoId}`;
    }

    // YOUTUBE NORMAL URL
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];

      return `https://www.youtube.com/embed/${videoId}`;
    }

    // GOOGLE DRIVE
    if (url.includes("drive.google.com")) {
      const fileId = url.split("/d/")[1]?.split("/")[0];

      return `https://drive.google.com/file/d/${fileId}/preview`;
    }

    return url;
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
    if (!category || !thumbnail || !driveLink) {
      alert("Fill all fields");

      return;
    }

    let finalTitle = title;
    const finalDriveLink = convertToPreviewLink(driveLink);
    // SERIES MODE
    if (selectedSeries) {
      if (!season || !episode) {
        alert("Add season and episode");

        return;
      }

      const selected = series.find(
        (item) => Number(item.id) === Number(selectedSeries),
      );

      if (!selected) {
        alert("Series not found");

        return;
      }

      finalTitle = `${selected.title} - Season ${season} Episode ${episode}`;
    }

    // NORMAL MOVIE
    if (!selectedSeries && !title) {
      alert("Enter movie title");

      return;
    }

    // UPDATE
    if (editId) {
      const { error } = await supabase
        .from("movies")
        .update({
          title: finalTitle,
          category,
          thumbnail,
          drive_link:
  finalDriveLink,
          season: season || null,
          episode: episode || null,
          series_id: selectedSeries ? Number(selectedSeries) : null,
        })
        .eq("id", editId);

      if (error) {
        alert(error.message);

        return;
      }

      alert("Movie Updated");

      resetForm();

      fetchMovies();

      return;
    }

    // ADD
    const { error } = await supabase.from("movies").insert([
      {
        title: finalTitle,
        category,
        thumbnail,
        drive_link:
  finalDriveLink,
        season: season || null,
        episode: episode || null,
        series_id: selectedSeries ? Number(selectedSeries) : null,
      },
    ]);

    if (error) {
      alert(error.message);

      return;
    }

    alert("Movie Added");

    resetForm();

    fetchMovies();
  };

  // DELETE
  const deleteMovie = async (id: number) => {
    const confirmDelete = confirm("Delete this movie?");

    if (!confirmDelete) return;

    await supabase.from("movies").delete().eq("id", id);

    alert("Movie Deleted");

    fetchMovies();
  };

  // LOADING
  if (loading) {
    return (
      <main className="bg-black text-white min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold animate-pulse">Loading...</h1>
      </main>
    );
  }

  // UNAUTHORIZED
  if (!authorized) {
    return (
      <main className="bg-black text-white min-h-screen flex items-center justify-center px-4">
        <div className="bg-zinc-900 p-10 rounded-2xl text-center max-w-md w-full border border-red-600">
          <h1 className="text-5xl mb-4">❌</h1>

          <h2 className="text-3xl font-bold text-red-600 mb-4">
            Access Denied
          </h2>

          <p className="text-gray-400 leading-7">
            You are not authorized to access admin panel
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-black min-h-screen text-white px-4 py-10">
      <div className="max-w-7xl mx-auto">
        {/* FORM */}
        <div className="bg-zinc-900 p-10 rounded-2xl border border-zinc-800 shadow-2xl">
          {/* HEADING */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold text-red-600 mb-4">
              CINEVERSE ADMIN
            </h1>

            <p className="text-gray-400">Upload and manage movies</p>
          </div>

          <div className="space-y-6">
            {/* CREATE SERIES */}
            <div className="bg-black p-6 rounded-2xl border border-zinc-800">
              <h2 className="text-2xl font-bold mb-4">📺 Create New Series</h2>

              <input
                type="text"
                placeholder="Series Title"
                value={seriesTitle}
                onChange={(e) => setSeriesTitle(e.target.value)}
                className="w-full bg-zinc-900 p-4 rounded-xl outline-none border border-zinc-700 focus:border-red-600 transition"
              />

              <button
                onClick={addSeries}
                className="mt-4 bg-blue-600 px-6 py-3 rounded-xl hover:bg-blue-700 transition"
              >
                ➕ Add Series
              </button>
            </div>

            {/* SELECT SERIES */}
            <select
              value={selectedSeries}
              onChange={(e) => setSelectedSeries(e.target.value)}
              className="w-full bg-black p-4 rounded-xl outline-none border border-zinc-800 focus:border-red-600 transition cursor-pointer"
            >
              <option value="">Select Existing Series</option>

              {series.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>

            {/* NORMAL MOVIE TITLE */}
            {category !== "Web Series" && !selectedSeries && (
              <input
                type="text"
                placeholder="Movie Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black p-4 rounded-xl outline-none border border-zinc-800 focus:border-red-600 transition"
              />
            )}

            {/* CATEGORY */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-black p-4 rounded-xl outline-none border border-zinc-800 focus:border-red-600 transition cursor-pointer"
            >
              <option value="">Select Category</option>

              <option value="Bollywood">Bollywood</option>

              <option value="South Movies">South Movies</option>

              <option value="Web Series">Web Series</option>

              <option value="Anime">Anime</option>
            </select>

            {/* SERIES INFO */}
            {(selectedSeries || category === "Web Series") && (
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Season"
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full bg-black p-4 rounded-xl outline-none border border-zinc-800 focus:border-red-600 transition"
                />

                <input
                  type="text"
                  placeholder="Episode"
                  value={episode}
                  onChange={(e) => setEpisode(e.target.value)}
                  className="w-full bg-black p-4 rounded-xl outline-none border border-zinc-800 focus:border-red-600 transition"
                />
              </div>
            )}

            {/* THUMBNAIL */}
            <input
              type="text"
              placeholder="Thumbnail URL"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="w-full bg-black p-4 rounded-xl outline-none border border-zinc-800 focus:border-red-600 transition"
            />

            {/* LINK */}
            <input
              type="text"
              placeholder="Movie Link / YouTube Embed / Drive Preview"
              value={driveLink}
              onChange={(e) => setDriveLink(e.target.value)}
              className="w-full bg-black p-4 rounded-xl outline-none border border-zinc-800 focus:border-red-600 transition"
            />

            {/* BUTTON */}
            <button
              onClick={addMovie}
              className="w-full bg-red-600 py-4 rounded-xl text-xl font-semibold cursor-pointer hover:bg-red-700 transition duration-300"
            >
              {editId ? "✏ Update Movie" : "🎬 Publish"}
            </button>
          </div>
        </div>

        {/* MOVIES */}
        <div className="mt-14">
          <h2 className="text-4xl font-bold mb-8">Uploaded Movies</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:scale-105 transition duration-300"
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
                  <h3 className="text-xl font-bold line-clamp-2">
                    {movie.title}
                  </h3>

                  <p className="text-gray-400 mt-2">{movie.category}</p>

                  {movie.season && (
                    <p className="text-sm text-red-500 mt-2">
                      Season {movie.season} • Episode {movie.episode}
                    </p>
                  )}

                  {/* EDIT */}
                  <button
                    onClick={() => editMovie(movie)}
                    className="mt-4 w-full bg-blue-600 py-3 rounded-xl hover:bg-blue-700 transition cursor-pointer"
                  >
                    ✏ Edit
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => deleteMovie(movie.id)}
                    className="mt-3 w-full bg-red-600 py-3 rounded-xl hover:bg-red-700 transition cursor-pointer"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
