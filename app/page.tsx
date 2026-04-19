import { OpenLoopProvider } from "@/components/OpenLoopProvider";
import { AppShell } from "@/components/AppShell";

export default function Home() {
  return (
    <OpenLoopProvider>
      <AppShell />
    </OpenLoopProvider>
  );
}
