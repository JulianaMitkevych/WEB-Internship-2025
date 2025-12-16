'use client';

import { useState, useMemo } from 'react';
import { onboardingData, TOTAL_ONBOARDING_STEPS } from '@/data/onboardingData';
import { Button } from '@/components/ui/button';

const IconPlaceholder = ({ iconName }: { iconName: string }) => {
  const iconMap = {
    plantOne: '🌱',
    plantTwo: '🪴',
    plantThree: '🌿',
  };
  return (
    <div className="mb-8 text-8xl h-48 flex items-center justify-center">
      {iconMap[iconName as keyof typeof iconMap] || '❓'}
    </div>
  );
};

type OnboardingStepperProps = {
  onFinish: () => void;
};

const OnboardingStepper = ({ onFinish }: OnboardingStepperProps) => {
  const [currentStepId, setCurrentStepId] = useState(onboardingData[0].id);

  const { currentStep, isLastStep, nextStepId } = useMemo(() => {
    const currentIndex = onboardingData.findIndex(
      (step) => step.id === currentStepId
    );
    const step = onboardingData[currentIndex];

    const isLast = currentIndex === TOTAL_ONBOARDING_STEPS - 1;

    let nextId = null;
    if (!isLast) {
      nextId = onboardingData[currentIndex + 1].id;
    }

    return {
      currentStep: step,
      isLastStep: isLast,
      nextStepId: nextId,
    };
  }, [currentStepId]);

  if (!currentStep) {
    return <div>Error: step not found</div>;
  }

  const handleNext = () => {
    if (isLastStep) {
      console.log('Onboarding completed. Updating user status...');
      onFinish();
    } else if (nextStepId) {
      setCurrentStepId(nextStepId);
    }
  };

  const handleSkip = () => {
    console.log('Onboarding skipped. Redirecting...');
    onFinish();
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white pt-10">
      <div className="w-full max-w-sm px-6">
        <IconPlaceholder iconName={currentStep.iconName} />

        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-night-sky mb-4">
            {currentStep.title}
          </h2>
          <p className="text-base text-grey-x-dark">
            {currentStep.description}
          </p>
        </div>

        <div className="flex justify-center space-x-2 mb-10">
          {onboardingData.map((step) => (
            <div
              key={step.id}
              className={`h-2 rounded-full transition-all duration-300 ${
                step.id === currentStepId
                  ? 'w-8 bg-[#4CAF50]'
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between items-center w-full">
          <button
            onClick={handleSkip}
            className="text-base text-grey-x-dark font-medium"
          >
            Skip
          </button>
          <Button
            onClick={handleNext}
            variant="gradient"
            className="px-8 text-base rounded-2xl"
          >
            {isLastStep ? 'Start Growing' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStepper;
