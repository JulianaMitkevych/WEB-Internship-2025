import { ECropType } from '@/types/types';

export const cropTypes: { id: keyof typeof ECropType; name: ECropType }[] = [
  { id: 'MICROGREENS', name: ECropType.MICROGREENS },
  { id: 'HERBS', name: ECropType.HERBS },
  { id: 'VEGETABLES', name: ECropType.VEGETABLES },
  { id: 'MUSHROOMS', name: ECropType.MUSHROOMS },
  { id: 'FLOWERING', name: ECropType.FLOWERING },
];
