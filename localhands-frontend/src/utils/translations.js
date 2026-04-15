/**
 * Translation constants for utility functions
 * These are fallback translations used in utils where t() function is not available
 */

export const TRANSLATIONS = {
  // Validation errors (only used for utils without t() function)
  validation: {
    photoRequired: 'Please add at least one photo',
    categoryRequired: 'Please select at least one category',
    locationRequired: 'Please select a location on the map',
    reviewsFetchFailed: 'Failed to fetch reviews',
    passwordMismatch: 'Passwords do not match'
  },
  
  // Settings and profile messages
  profileUpdatedSuccessfully: 'Profile updated successfully!',
  failedToUpdateProfile: 'Failed to update profile',
  accountUpdated: 'Account updated successfully!',
  errorUpdatingAccount: 'Error updating account',
  accountDeleteConfirm: 'Are you sure you want to delete your account? This action cannot be undone.',
  accountDeletedSuccessfully: 'Account deleted successfully!',
  errorDeletingAccount: 'Error deleting account: ',
  
  // Category names
  categories: {
    CLEANING: 'Cleaning',
    PLUMBING: 'Plumbing',
    ELECTRICAL: 'Electrical',
    GARDENING: 'Gardening',
    PAINTING: 'Painting',
    CARPENTRY: 'Carpentry',
    HANDYMAN: 'Handyman',
    MOVING: 'Moving',
    DELIVERY: 'Delivery',
    HEAVY_LIFTING: 'Heavy Lifting',
    TUTORING: 'Tutoring',
    IT_SUPPORT: 'IT Support',
    TECH_SETUP: 'Tech Setup',
    PET_CARE: 'Pet Care',
    BABYSITTING: 'Babysitting',
    CAR_WASH: 'Car Wash',
    CAR_REPAIR: 'Car Repair',
    BEAUTY: 'Beauty',
    HAIRDRESSING: 'Hairdressing',
    PHOTOGRAPHY: 'Photography',
    VIDEOGRAPHY: 'Videography',
    FITNESS_TRAINING: 'Fitness Training',
    EVENT_HELP: 'Event Help',
    CATERING: 'Catering',
    HOME_REPAIR: 'Home Repair',
    APPLIANCE_REPAIR: 'Appliance Repair',
    OTHER: 'Other'
  }
};
