import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";

const ClientHome = dynamic(
  () => import("./client-home"),
  {
    ssr: false,
  }
);

export default async function Home() {

  const { data: movies } =
    await supabase
      .from("movies")
      .select("*")
      .order("views", {
        ascending: false,
      });

  return (
    <ClientHome movies={movies || []} />
  );
}