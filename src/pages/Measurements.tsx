import MesaurementsForm from "../components/layout/MesaurementsForm";
import { MesaurementsTable } from "../components/layout/MesaurementsTable";
import { WeightChart } from "@/components/layout/WeightChart";
import { BodyMassChart } from "@/components/layout/BodyMassChart";
export default function Measurements() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 pb-24">
      <section className="flex justify-center">
        <h1 className="text-2xl font-bold gap-2 items-center flex"> 
          <img src="custom emoji/bodyCompositionScannerEmoji.png" className="h-17 w-17" />
          Misurazioni</h1>
      </section>
      <section  >
        <MesaurementsForm />
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <WeightChart />
        <BodyMassChart />
      </section>
      <section>
        <MesaurementsTable />
      </section>
    </main>
  );
}
