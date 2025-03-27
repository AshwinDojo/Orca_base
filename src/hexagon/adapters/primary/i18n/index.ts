/**
 * Internationalization (i18n) configuration
 */

// Available languages
export type Language = 'en' | 'es' | 'fr';

// Default language
export const DEFAULT_LANGUAGE: Language = 'en';

// Translation dictionary type
export type TranslationDictionary = {
  [key: string]: {
    [key: string]: string;
  };
};

// Translation dictionaries for different domains
export const translations: TranslationDictionary = {
  shipmentStatus: {
    'CREATED': 'Created',
    'PROCESSING': 'Processing',
    'IN_TRANSIT': 'In Transit',
    'OUT_FOR_DELIVERY': 'Out For Delivery',
    'PICKED_UP': 'Picked Up',
    'DELIVERED': 'Delivered',
    'FAILED_DELIVERY': 'Failed Delivery',
    'CANCELED': 'Canceled'
  },
  serviceTypes: {
    'B2B': 'Business to Business',
    'B2C': 'Business to Consumer',
    'INTERNATIONAL': 'International'
  },
  common: {
    'loading': 'Loading...',
    'noData': 'No data available',
    'error': 'An error occurred',
    'save': 'Save',
    'cancel': 'Cancel',
    'delete': 'Delete',
    'edit': 'Edit',
    'view': 'View'
  }
};

/**
 * Get translation for a key in a specific domain
 * @param domain - The translation domain (e.g., 'shipmentStatus')
 * @param key - The translation key
 * @returns The translated string or the key if translation not found
 */
export const translate = (domain: string, key: string): string => {
  if (translations[domain] && translations[domain][key]) {
    return translations[domain][key];
  }
  return key;
};

/**
 * Shorthand for shipment status translations
 */
export const formatStatus = (status: string): string => {
  return translate('shipmentStatus', status);
};

/**
 * Format status string for CSS class name
 * Replaces underscores with hyphens and converts to lowercase
 */
export const formatStatusForClassName = (status: string): string => {
  return status.toLowerCase().replace(/_/g, '-');
}; 