import { createFileRoute } from "@tanstack/react-router";
import { HearthApp } from "@/components/hearth-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <HearthApp />;
}
