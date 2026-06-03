import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useMeasurementsHistory } from "@/hooks/useMesauremetsHistory";

export const description = "A line chart with a label";

const chartConfig = {
  weight: {
    label: "Peso",
    color: "var(--chart-weight)",
  },
} satisfies ChartConfig;

export function WeightChart() {
  const dataHistory = useMeasurementsHistory(true);
  const chartData = dataHistory.map((entry) => ({
    date: entry.dateInput,
    weight: entry.weight,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#1447E6]">Peso</CardTitle>
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
              interval={0}
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
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="weight"
              type="natural"
              stroke="var(--color-weight)"
              strokeWidth={2}
              dot={{
                fill: "var(--background)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              {" "}
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
