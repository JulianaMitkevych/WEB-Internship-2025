import { cropTypes } from '@/app/crope-type/cropeList';
import CropButton from '@/components/base/crope-button/CropeButton';

cropTypes.map((crop) => (
  <CropButton
    key={crop.id}
    label={crop.name}
    route={`/userPlants/${crop.id.toLowerCase()}`} // або збережений plantId
  />
));
