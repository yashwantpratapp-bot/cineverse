export const dynamic = "force-dynamic";

import ClientHome from "./client-home";
import { supabase } from "@/lib/supabase";

export default async function Home() {

  const { data: movies, error } =
    await supabase
      .from("movies")
.select("*")
.is("series_id", null)
.order("views", {
  ascending: false,
});
const { data: series } =
  await supabase
    .from("series")
    .select("*")
    .order("id", {
      ascending: false,
    });
  if (error) {

    return (
      <main className="bg-black text-white min-h-screen flex items-center justify-center">

        <h1 className="text-3xl font-bold">
          Failed to load movies
        </h1>

      </main>
    );
  }

  return (
    <ClientHome
  movies={movies || []}
  series={series || []}
/>
  );
}