import MesaurementsForm from "../components/MesaurementsForm";
import { MesaurementsTable } from "../components/MesaurementsTable";

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
      <MesaurementsTable/>

      {/* In futuro potrai facilmente aggiungere la tabella dello storico o il grafico qui sotto */}
      {/* <WeightChart /> */}
    </div>
  );
}
