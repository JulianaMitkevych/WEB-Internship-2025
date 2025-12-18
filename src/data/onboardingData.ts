import PlantOne from '@/assets/svg/PlantOne';
import  PlantTwo from '@/assets/svg/PlantTwo';
import PlantThree from '@/assets/svg/PlantThree';

export type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

export const onboardingData: OnboardingStep[] = [
  {
    id: '1',
    title: 'Choose Your Plants',
    description:
      'Welcome to GrowBox! Select your favorite plants and begin cultivating your personal garden.',
    Icon: PlantOne,
  },
  {
    id: '2',
    title: 'Connect and Control',
    description:
      'Connect your GrowBox and control watering, lighting, and temperature right from your smartphone.',
    Icon: PlantTwo,
  },
  {
    id: '3',
    title: 'Observe and Grow',
    description:
      "See your plants flourish with helpful graphs. You're set to grow and succeed!",
    Icon: PlantThree,
  },
];

export const TOTAL_ONBOARDING_STEPS = onboardingData.length;
