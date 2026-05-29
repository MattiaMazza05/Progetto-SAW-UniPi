import MesaurementsForm from "../components/MesaurementsForm";
import { MesaurementsTable } from "../components/MesaurementsTable";
import { ChartBarDemoLegend } from "@/components/MesaurementsChart";


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
    </div>
  );
}
