'use client';
import { TChartPeriod } from '@/types/types';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

interface SmartChartProps {
  data: any[]; // 'data' include: name, value, date
  period: TChartPeriod; 
  color?: string;
  unit?: string;
}

export const SmartChart = ({
  data,
  period,
  color = '#65D11F',
  unit = '',
}: SmartChartProps) => {
  // interval
  const labelInterval = period === 'month' ? Math.floor(data.length / 5) : 0;

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
          tick={({ x, y, payload, index }) => {
            const item = data[index];
            return (
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
                
                {/* additional date */}
                {(period === 'week' || period === 'month') && item?.date && (
                  <text
                    x={0}
                    y={18}
                    textAnchor="middle"
                    fill="#A3A3A3"
                    fontSize={11}
                  >
                    {new Date(item.date).toLocaleDateString('uk-UA', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </text>
                )}
              </g>
            );
          }}
        />

        {/* <YAxis hide domain={['auto', 'auto']} /> */}
        <YAxis hide={false} width={40}  fontSize ={10}/>

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
            const { x, y, value, index } = props;

            const shouldShow =
              labelInterval === 0 || 
              index % labelInterval === 0 || 
              index === data.length - 1;

            if (!shouldShow) return <g key={`label-empty-${index}`} />;

            return (
              <text
                key={`label-${index}`}
                x={x}
                y={y - 15} // точки для кращої читаємості
                fill={color}
                fontSize={12}
                fontWeight="700"
                textAnchor="middle"
              >
                {value}{unit}
              </text>
            );
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};