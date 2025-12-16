export type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  // icon: React.FC<React.SVGProps<SVGSVGElement>>; //for react component svg
  iconName: 'plantOne' | 'plantTwo' | 'plantThree'; // name svg
};

export const onboardingData: OnboardingStep[] = [
  {
    id: '1',
    title: 'Choose Your Plants', // Onboarding 1
    description:
      'Welcome to GrowBox! Select your favorite plants and begin cultivating your personal garden.',
    iconName: 'plantOne',
  },
  {
    id: '2',
    title: 'Connect and Control', // Onboarding 2
    description:
      'Connect your GrowBox and control watering, lighting, and temperature right from your smartphone.',
    iconName: 'plantTwo',
  },
  {
    id: '3',
    title: 'Observe and Grow', // Onboarding 3
    description:
      "See your plants flourish with helpful graphs. You're set to grow and succeed!",
    iconName: 'plantThree',
  },
];

export const TOTAL_ONBOARDING_STEPS = onboardingData.length;
