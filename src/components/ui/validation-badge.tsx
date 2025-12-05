import React from 'react';
import { Check } from 'lucide-react';
import { Badge } from './badge';

type TValidationBadgeProps = {
  isValid: boolean;
  text: string;
};

export function ValidationBadge({ isValid, text }: TValidationBadgeProps) {
  return (
    <Badge
      className={`bg-dust text-sm flex items-center gap-1.5 ${isValid ? 'text-grass' : 'text-grey-xxx-dark'}`}
    >
      {isValid && (
        <div className="bg-grass rounded-full p-0.5">
          <Check className="h-2.5 w-2.5 text-white" />
        </div>
      )}
      {text}
    </Badge>
  );
}
