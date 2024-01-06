import {
  faMaskFace,
  faHouseMedical,
  faSyringe,
  faPlane,
  faCoffee,
  faBan,
  faSchoolCircleXmark,
  faSchoolFlag,
  faSchool,
  faCandyCane,
  faCakeCandles,
  faGraduationCap,
  faChampagneGlasses,
  faCheckToSlot,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

import type { NoPhotoReason } from './types';

const noPhotoPlaceholders: Record<NoPhotoReason, IconDefinition> = {
  sick: faMaskFace,
  doctor: faHouseMedical,
  immunization: faSyringe,
  holiday: faCoffee,
  travel: faPlane,
  empty: faBan,
  christmas: faCandyCane,
  birthday: faCakeCandles,
  school: faSchool,
  celebrate: faChampagneGlasses,
  graduation: faGraduationCap,
  poll: faCheckToSlot,
  'school-event': faSchoolFlag,
  'school-close': faSchoolCircleXmark,
};

export { noPhotoPlaceholders };
