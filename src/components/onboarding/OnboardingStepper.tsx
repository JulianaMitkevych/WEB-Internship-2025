

'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { onboardingData, TOTAL_ONBOARDING_STEPS } from '@/data/onboardingData';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/utils/constants';
import { ChevronRight } from 'lucide-react';

const OnboardingStepper = () => {
  const [currentStepId, setCurrentStepId] = useState(onboardingData[0].id);
  const router = useRouter();

  const { currentStep, isLastStep, nextStepId } = useMemo(() => {
    const currentIndex = onboardingData.findIndex(
      (step) => step.id === currentStepId
    );
    const step = onboardingData[currentIndex];
    const isLast = currentIndex === TOTAL_ONBOARDING_STEPS - 1;

    return {
      currentStep: step,
      isLastStep: isLast,
      nextStepId: isLast ? null : onboardingData[currentIndex + 1].id,
    };
  }, [currentStepId]);

  if (!currentStep) return <div>Error: step not found</div>;

  const StepIcon = currentStep.Icon;

  // Handle card click navigation
  const handleCardClick = () => {
    if (currentStep.title.includes('Plants')) {
      router.push(ROUTES.SELECT_CROP_TYPE);
    } else if (currentStep.title.includes('Connect')) {
      router.push(ROUTES.CONNECT_DEVICE);
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      // TODO: Add check if crop type is selected before going to dashboard
      // For now, just go to dashboard
      router.push(ROUTES.DASHBOARD);
    } else if (nextStepId) {
      setCurrentStepId(nextStepId);
    }
  };

  const handleSkip = () => {
    router.push(ROUTES.DASHBOARD);
  };

  return (
    <div className="flex flex-col items-center  bg-white pt-[10px] h-screen ">
      <div className="text-center">
        <h2 className="text-[28px] font-bold text-[#020202]">
          {currentStep.title}
        </h2>
      </div>

      <div className="w-full max-w-sm px-6 flex flex-col items-center mt-[20px]  min-h-0">
        {/* button =disabled*/}
        <button
          onClick={handleCardClick}
          disabled={false}
          className="relative w-full h-[320px] flex items-center justify-center transition-transform active:scale-95 disabled:opacity-100 disabled:pointer-events-none"
        >
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10 w-[312px] sm:w-[326px] h-[238px] bg-white rounded-[40px] shadow-[0_0_20px_rgba(0,0,0,0.1)]"></div>
          <div className="relative z-20 h-[320px] w-[280px] sm:w-[288px] bg-white rounded-[40px] shadow-[0_0_20px_rgba(0,0,0,0.1)] flex items-center justify-center overflow-hidden">
            <StepIcon className="w-48 h-48 object-contain" />
          </div>
        </button>

        <div className="text-center mt-[16px]  ">
          <p className="text-[16px]  sm:text-[18px] text-[#020202] leading-relaxed  whitespace-pre-line">
            {currentStep.description}
          </p>
        </div>

        <div className="flex justify-center space-x-2 mt-[22px]">
          {onboardingData.map((step) => (
            <div
              key={step.id}
              className={`h-2 rounded-full transition-all duration-300 ${
                step.id === currentStepId
                  ? 'w-8 bg-gradient-to-b from-[#53C904] to-[#2F7302]'
                  : 'w-2 bg-[#D5E3CC]'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between items-center w-full mt-[22px] ">
          <button
            onClick={handleSkip}
            className="text-base text-[#2F7302] font-semibold hover:opacity-70 transition-opacity"
          >
            Skip
          </button>

          <Button
            onClick={handleNext}
            variant="gradient"
            className="px-10 py-6 text-base w-[121px] h-[44px] rounded-[12px] text-white 
                   bg-gradient-to-b from-[#53C904] to-[#2F7302] 
                   hover:from-[#2F7302] hover:to-[#53C904] 
                   focus:from-[#2F7302] focus:to-[#53C904]"
          >
            Next
            <ChevronRight className="size-5 text-[#2F7302]" strokeWidth={3} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStepper;
