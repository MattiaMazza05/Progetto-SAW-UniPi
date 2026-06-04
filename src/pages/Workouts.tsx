import WorkoutsForm from "@/components/layout/WorkoutsForm";
import { RunChart } from "@/components/layout/RunChart";
import { GymChart } from "@/components/layout/GymChart";
export default function Workouts() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 pb-24">
      <section className="flex justify-center">
        <h1 className="text-2xl font-bold gap-2 items-center flex">
          <img
            src="custom emoji/fitnessTrainerEmoji.png"
            className="h-17 w-17"
          />
          Diario Allenamenti
        </h1>
      </section>
      <section><WorkoutsForm/></section>

      <section className="grid gap-4 md:grid-cols-2">
        <RunChart/>
        <GymChart/>
      </section>
      <section>tabella</section>
    </main>
  );
}
