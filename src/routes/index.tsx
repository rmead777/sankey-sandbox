import { createFileRoute } from "@tanstack/react-router";
import { Workbench } from "@/components/flume/workbench";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <Workbench />;
}
