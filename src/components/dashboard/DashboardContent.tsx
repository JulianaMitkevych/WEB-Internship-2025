
// 'use client';

// import { Button } from '@/components/ui/button'; for charts

const DashboardContent = () => {
  // icon plants
  // title 
  // slider
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 text-center">
      <h1 className="text-3xl font-bold text-[#4CAF50] mb-4">
        🎉Welcome Dashboard Page🎉
      </h1>
      <p className="text-lg text-gray-600 mb-8">
       You have successfully passed the dashboard
      </p>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-3 text-night-sky">
         Show all Chart
        </h2>
        <p className="text-gray-500">
          (`/device-connect`).
        </p>
      </div>
      {/* chart:temperature,nutrition, light,humidity(settings) */}
    </div>
  );
};

export default DashboardContent;
