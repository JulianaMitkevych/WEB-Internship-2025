'use client';

import React, {
  ReactNode,
  isValidElement,
  cloneElement,
  ReactElement,
} from 'react';

type TPercentageIndicatorProps = {
  icon: ReactNode;
  color: string;
  percentage: number;
  title?: string;
  size?: number;
};

export function PercentageIndicator({
  icon,
  color,
  percentage,
  title,
  size = 24,
}: TPercentageIndicatorProps) {
  // Ensure percentage is between 0 and 100
  const normalizedPercentage = Math.min(Math.max(percentage, 0), 100);

  // Calculate the circumference of the circle
  const radius = (size - 4) / 2; // Account for stroke width
  const circumference = 2 * Math.PI * radius;

  // Calculate the stroke dasharray and offset for the progress
  const strokeDasharray = circumference;
  const strokeDashoffset =
    circumference - (normalizedPercentage / 100) * circumference;

  return (
    <div className="flex items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeOpacity="0.2"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.3s ease',
            }}
          />
        </svg>
        {/* Icon in the center */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ color }}
        >
          {isValidElement(icon)
            ? cloneElement(
                icon as ReactElement<{ size?: number; color?: string }>,
                {
                  size: size * 0.8,
                  color,
                }
              )
            : icon}
        </div>
      </div>
      {/* Percentage text */}
      <div className="flex items-center gap-1">
        {title && (
          <span className="text-lg text-night-sky font-normal leading-none">
            {title}
          </span>
        )}
        <span className="text-lg font-normal leading-none text-grey-x-dark">
          {Math.round(normalizedPercentage)}%
        </span>
      </div>
    </div>
  );
}
