import { getFirms } from "../lib/api";
import HomeClient from "./HomeClient";

export default async function Home() {
  const firms = await getFirms();
  return <HomeClient firms={firms} />;
}
