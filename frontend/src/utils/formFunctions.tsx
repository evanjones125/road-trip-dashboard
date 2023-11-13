import type { FormData, FormErrors } from '../types/types';

export const DEFAULT_FORM_DATA: FormData = {
  locationName: '',
  tripName: '',
  latitude: '',
  longitude: '',
  user: '',
  dateRange: [],
};

export const DEFAULT_FORM_ERRORS: FormErrors = {
  locationName: '',
  tripName: '',
  latitude: '',
  longitude: '',
  dateRange: '',
};

export const formatDate = (date: Date): string => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// checks either a trip or a location form submission for any bad inputs
export const validateInput = (formData: FormData, typeOfForm: string) => {
  let isValid = true;
  const errors: FormErrors = { ...DEFAULT_FORM_ERRORS };

  const location = typeOfForm === 'location';

  if (location) {
    if (!formData.locationName.trim()) {
      errors.locationName = 'Location name is required.';
      isValid = false;
    }

    const latitudePattern = /^[0-8]?\d(\.\d{1,6})?$/;
    if (!latitudePattern.test(formData.latitude)) {
      errors.latitude = 'Enter a valid latitude value.';
      isValid = false;
    }

    const longitudePattern = /^-([1-9]\d?|1[0-7]\d)(\.\d{1,6})?$/;
    if (!longitudePattern.test(formData.longitude)) {
      errors.longitude = 'Enter a valid longitude value.';
      isValid = false;
    }
  }

  if (!location && !formData.tripName.trim()) {
    errors.tripName = 'Trip name is required.';
    isValid = false;
  }

  if (!formData.dateRange[0] || !formData.dateRange[1]) {
    errors.dateRange = 'Both start and end dates are required.';
    isValid = false;
  }

  return isValid ? {} : errors;
};
