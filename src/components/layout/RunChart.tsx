import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useWorkoutHistory } from "@/hooks/useWorkoutHistory";

export const description = "A line chart with dots";

const chartConfig = {
  distance: {
    label: "Distanza",
    color: "var(--chart-distance)",
  },
} satisfies ChartConfig;

export function RunChart() {
  const workoutHistory = useWorkoutHistory(true);
  const chartData = workoutHistory
    .filter((entry) => entry.type === "Run" && entry.distance !== null)
    .map((entry) => ({
      date: entry.date,
      distance: entry.distance,
    }));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Corsa</CardTitle>
        <CardDescription>Chilometri settimanali corsi</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 8,
              left: 36,
              right: 36,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const [, month, day] = value.split("-");
                return `${day}/${month}`;
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="distance"
              type="natural"
              stroke="var(--color-distance)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-background)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
