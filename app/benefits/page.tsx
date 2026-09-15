import Benefits from "@/components/Benefits";
import Cookbook from "@/components/Cookbook";

export default function BenefitsPage() {
  return (
    <main>
      <Benefits />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-light/70 dark:bg-white/8" />
      </div>
      <Cookbook />
    </main>
  );
}