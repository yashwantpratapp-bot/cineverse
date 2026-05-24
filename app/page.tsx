import { supabase } from "@/lib/supabase";
import ClientHome from "./client-home";

export default async function Home() {

  const { data: movies } = await supabase
    .from("movies")
    .select("*");

  return <ClientHome movies={movies || []} />;
}