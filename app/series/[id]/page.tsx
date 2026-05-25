"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import { supabase }
from "@/lib/supabase";

export default function SeriesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const [series, setSeries] =
    useState<any>(null);

  const [episodes, setEpisodes] =
    useState<any[]>([]);

  useEffect(() => {

    const fetchSeries =
      async () => {

        const { id } =
          await params;

        // SERIES
        const {
          data: seriesData,
        } =
          await supabase
            .from("series")
            .select("*")
            .eq("id", id)
            .single();

        setSeries(
          seriesData
        );

        // EPISODES
        const {
          data: episodeData,
        } =
          await supabase
            .from("movies")
            .select("*")
            .eq(
              "series_id",
              id
            )
            .order(
              "season",
              {
                ascending: true,
              }
            )
            .order(
              "episode",
              {
                ascending: true,
              }
            );

        setEpisodes(
          episodeData || []
        );
      };

    fetchSeries();

  }, [params]);

  if (!series) {

    return (
      <main className="bg-black min-h-screen text-white flex items-center justify-center">

        Loading...

      </main>
    );
  }

  return (
    <main className="bg-black min-h-screen text-white">

      {/* Banner */}
      <div
        className="h-[60vh] bg-cover bg-center flex items-end"
        style={{
          backgroundImage:
            `url(${series.thumbnail})`,
        }}
      >

        <div className="bg-gradient-to-t from-black via-black/60 to-transparent w-full p-10">

          <h1 className="text-6xl font-bold mb-4">
            {series.title}
          </h1>

          <p className="text-xl text-gray-300">
            {series.category}
          </p>

        </div>

      </div>

      {/* Episodes */}
      <div className="p-10">

        <h2 className="text-4xl font-bold mb-10">
          Episodes
        </h2>

        <div className="space-y-6">

          {episodes.map(
            (episode) => (

              <Link
                href={`/movie/${episode.id}`}
                key={episode.id}
                className="flex gap-6 bg-zinc-900 p-4 rounded-2xl hover:bg-zinc-800 transition"
              >

                <img
                  src={
                    episode.thumbnail
                  }
                  alt={
                    episode.title
                  }
                  className="w-52 h-32 object-cover rounded-xl"
                />

                <div>

                  <h3 className="text-2xl font-bold">
                    Season {
                      episode.season
                    } Episode {
                      episode.episode
                    }
                  </h3>

                  <p className="text-gray-400 mt-3">
                    {
                      episode.title
                    }
                  </p>

                </div>

              </Link>

            )
          )}

        </div>

      </div>

    </main>
  );
}