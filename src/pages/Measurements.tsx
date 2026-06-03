import MesaurementsForm from "../components/layout/MesaurementsForm";
import { MesaurementsTable } from "../components/layout/MesaurementsTable";
import { WeightChart } from "@/components/layout/WeightChart";
import { BodyMassChart } from "@/components/layout/BodyMassChart";
export default function Measurements() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold dark:text-white">
        Sezione Measurements
      </h1>
      <p className="dark:text-gray-300">
        Benvenuto nella tua sezione measurements.
      </p>
      <MesaurementsForm />
      <MesaurementsTable />
      <WeightChart/>
      <BodyMassChart/>
    </div>
  );
}
