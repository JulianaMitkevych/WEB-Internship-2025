import * as React from 'react';

type PlantIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export const PlantIcon: React.FC<PlantIconProps> = ({
  size = 84,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 84 84"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M73.493 10.5V17.5C73.493 23.9978 70.9117 30.2295 66.3171 34.8241C61.7225 39.4188 55.4908 42 48.993 42H45.493V45.5H62.993V70C62.993 71.8565 62.2555 73.637 60.9427 74.9498C59.63 76.2625 57.8495 77 55.993 77H27.993C26.1365 77 24.356 76.2625 23.0432 74.9498C21.7305 73.637 20.993 71.8565 20.993 70V45.5H38.493V35C38.493 28.5022 41.0742 22.2705 45.6689 17.6759C50.2635 13.0813 56.4952 10.5 62.993 10.5H73.493ZM19.243 7.00001C23.4429 6.99661 27.5821 8.00235 31.3122 9.93257C35.0423 11.8628 38.254 14.661 40.677 18.0915C36.9808 22.9526 34.9838 28.8933 34.993 35V38.5H33.243C26.281 38.5 19.6043 35.7344 14.6814 30.8116C9.7586 25.8887 6.99298 19.2119 6.99298 12.25V7.00001H19.243Z"
      fill="url(#paint0_linear_216_3327)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_216_3327"
        x1={40.243}
        y1={7}
        x2={40.243}
        y2={77}
        gradientUnits="userSpaceOnUse"
      >
      <stop stopColor="#53C904" />
   <stop offset={1} stopColor="#2F7302" />
      </linearGradient>
    </defs>
  </svg>
);
