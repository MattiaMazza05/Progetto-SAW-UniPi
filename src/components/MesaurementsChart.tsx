import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import {
  onSnapshot,
  collection,
  query,
  orderBy,
} from "firebase/firestore";
import { Weight } from "lucide-react";

export interface MesauremetType {
  id: string;
  dateInput: string;
  weight: number;
  neck: number;
  waist: number;
  hips: number;
  bfP: number;
  fatMass: number;
  leanMass: number;
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig

export function ChartBarDemoLegend() {
      const { currentUser } = useAuth();
  const [dataHistory, setDataHistory] = useState<MesauremetType[]>([]);
  useEffect(() => {
    if (!currentUser) return;
    const mesaurementsRef = collection(
      db,
      "userData",
      currentUser.uid,
      "mesaurementsHistory",
    );
    const q = query(mesaurementsRef, orderBy("timeStamp", "desc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const rawData = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        } as MesauremetType;
      });
      setDataHistory(rawData);
    });
    return () => unsub();
  }, [currentUser]);
  const chartData = dataHistory.map((e) => ({
    month: e.dateInput,
    weight: e.weight,
    bodyFat: e.bfP
  }));

  return (
    <ChartContainer config={chartConfig} className="min-h-80 w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="weight" fill="var(--color--red)" radius={4} />
        <Bar dataKey="BF" fill="var(--color--blue)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
