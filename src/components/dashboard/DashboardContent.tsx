'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStorage } from '@/hooks/useStorage';
import { ROUTES } from '@/utils/constants';
import LightIcon from '@/assets/svg/LightIcon';
import TempIcon from '@/assets/svg/TempIcon';
import NutritionIcon from '@/assets/svg/NutritionIcon';
import HumidityIcon from '@/assets/svg/HumidityIcon';
import VentIcon from '@/assets/svg/VentIcon';
import WaterIcon from '@/assets/svg/WaterIcon';
import PlantOne from '@/assets/svg/PlantOne';
import PlantTwo from '@/assets/svg/PlantTwo';
import PlantThree from '@/assets/svg/PlantThree';
import { BottomNavigation } from '@/components/ui/bottom-navigation';


const DashboardContent = () => {
  const router = useRouter();
  const [store] = useStorage();
  const [growthDays] = useState(14); // Mock data - should come from API

  const parameters = ['light', 'temperature', 'humidity', 'nutrition', 'vent', 'watering'];


  const getPlantIcon = (cropType: string | null) => {
    switch (cropType) {
      case 'Microgreens': return <PlantOne />;
      case 'Herbs': return <PlantTwo />;
      case 'Vegetables': return <PlantThree />;
      case "Mushroom's": return <PlantOne />;
      case 'Flowering Plants': return <PlantTwo />;
      default: return <PlantOne />;
    }
  };

  const getParameterIcon = (param: string) => {
    switch (param) {
      case 'light': return <LightIcon />;
      case 'temperature': return <TempIcon />;
      case 'humidity': return <HumidityIcon />;
      case 'nutrition': return <NutritionIcon />;
      case 'vent': return <VentIcon />;
      case 'watering': return <WaterIcon />;
      default: return null;
    }
  };

  const getParameterLabel = (param: string) => {
    switch (param) {
      case 'light': return 'Light';
      case 'temperature': return 'Temperature';
      case 'humidity': return 'Humidity';
      case 'nutrition': return 'Nutrition';
      case 'vent': return 'Vent';
      case 'watering': return 'Watering';
      default: return param;
    }
  };

  const handleSettingClick = (setting: string) => {
    switch (setting) {
      case 'light': router.push(ROUTES.PLANT_SETTINGS.LIGHT);
      break;
      case 'temperature': router.push(ROUTES.PLANT_SETTINGS.TEMPERATURE);
      break;
      case 'humidity': router.push(ROUTES.PLANT_SETTINGS.HUMIDITY);
      break;
      case 'nutrition': router.push(ROUTES.PLANT_SETTINGS.NUTRITION);
      break;
      case 'vent': router.push(ROUTES.PLANT_SETTINGS.VENT);
      break;
      case 'watering': router.push(ROUTES.PLANT_SETTINGS.WATERING);
      break;
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Plant Info Section */}
      <div className="bg-white p-6 shadow-sm">
        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
            {getPlantIcon(store.user?.cropType || null)}
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {store.user?.cropType || 'Select Plant'}
          </h2>
        </div>
      </div>

      {/* Growth Days Scale */}
      <div className="bg-white mx-6 mt-6 p-4 rounded-2xl shadow-sm">
        <div className="flex justify-center gap-2 mb-4">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
            <button
              key={day}
              className={`w-8 h-8 rounded-xl border-2 transition-colors ${
                day <= growthDays
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'bg-gray-100 border-gray-200 text-gray-400'
              }`}
              disabled={day > growthDays}
            >
              {day}
            </button>
          ))}
        </div>
        <p className="text-center text-sm text-gray-600">
          Day {growthDays} of growth
        </p>
      </div>

      {/* Settings Buttons */}
      <div className="flex-1 p-6">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-4">
          {parameters.map((param) => (
            <button
              key={param}
              onClick={() => handleSettingClick(param)}
              className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center gap-3"
            >
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                {getParameterIcon(param)}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {getParameterLabel(param)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="home" />
    </div>
  );
};

export default DashboardContent;
