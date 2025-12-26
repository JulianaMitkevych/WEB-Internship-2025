
'use client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

type PeriodType = 'day' | 'week' | 'month';

interface SmartChartProps {
  data: any[];
  period: PeriodType;
  color?: string;
}

export const SmartChart = ({
  data,
  period,
  color = '#65D11F',
}: SmartChartProps) => {
  const labelInterval = period === 'month' ? 5 : 0;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 40, right: 20, left: 20, bottom: 40 }}
      >
        <CartesianGrid vertical={true} horizontal={false} stroke="#F2F2F2" />

        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          interval={labelInterval}
          tick={({ x, y, payload, index }) => (
            <g key={`tick-${index}`} transform={`translate(${x},${y + 15})`}>
              <text
                x={0}
                y={0}
                textAnchor="middle"
                fill="#A3A3A3"
                fontSize={12}
                fontWeight="500"
              >
                {payload.value}
              </text>
              {period === 'week' && data[index]?.date && (
                <text
                  x={0}
                  y={18}
                  textAnchor="middle"
                  fill="#A3A3A3"
                  fontSize={11}
                >
                  {data[index].date}
                </text>
              )}
            </g>
          )}
        />

        <YAxis hide domain={[0, 110]} />

        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2.5}
          
          dot={(props: any) => {
            const { cx, cy, index } = props;
            return (
              <circle
                key={`dot-${index}`} 
                cx={cx}
                cy={cy}
                r={4}
                fill="#fff"
                stroke={color}
                strokeWidth={2}
              />
            );
          }}
          label={(props: any) => {
            const { x, value, index } = props;

            const shouldShow =
              labelInterval === 0 ||
              index % labelInterval === 0 ||
              index === data.length - 1;

            if (!shouldShow) return <g key={`label-empty-${index}`} />;

            return (
              <text
                key={`label-${index}`} 
                x={x}
                y={25}
                fill={color}
                fontSize={12}
                fontWeight="700"
                textAnchor="middle"
              >
                {value}%
              </text>
            );
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};