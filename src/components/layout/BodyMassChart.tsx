import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useMeasurementsHistory } from "@/hooks/useMeasurementsHistory";

export const description = "A multiple line chart";

const chartConfig = {
  fatMass: {
    label: "Massa Grassa",
    color: "var(--chart-red)",
  },
  leanMass: {
    label: "Massa Magra",
    color: "var(--chart-green)",
  },
} satisfies ChartConfig;

export function BodyMassChart() {
  const dataHistory = useMeasurementsHistory(true);
  const chartData = dataHistory.map((entry) => ({
    date: entry.dateInput,
    fatMass: entry.fatMass,
    leanMass: entry.leanMass,
  }));
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="text-[#008236]">Massa magra</span>
          <span> e </span>
          <span className="text-[#E7000B]">Massa grassa</span>
        </CardTitle>
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
              dataKey="fatMass"
              type="natural"
              stroke="var(--color-fatMass)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-fatMass)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              {" "}
            </Line>
            <Line
              dataKey="leanMass"
              type="natural"
              stroke="var(--color-leanMass)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-leanMass)",
              }}
              activeDot={{
                r: 6,
              }}
            ></Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
