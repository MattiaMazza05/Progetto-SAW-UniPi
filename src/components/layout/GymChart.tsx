import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
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
  volume: {
    label: "Volume kg:",
    color: "var(--chart-volume)",
  },
} satisfies ChartConfig;

export function GymChart() {
  const workoutHistory = useWorkoutHistory(true);
  const chartData = workoutHistory
    .filter((entry) => entry.type === "Pesi")
    .map((entry) => ({
      date: entry.date,
      volume: entry.volume,
    }));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pesi</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 16,
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
              dataKey="volume"
              type="natural"
              stroke="var(--color-volume)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-volume)",
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
