/**
 * Status internationalization and formatting utilities
 */

// Status internationalization map
export const statusI18n: { [key: string]: string } = {
  'CREATED': 'Created',
  'PROCESSING': 'Processing',
  'IN_TRANSIT': 'In Transit',
  'OUT_FOR_DELIVERY': 'Out For Delivery',
  'PICKED_UP': 'Picked Up',
  'DELIVERED': 'Delivered',
  'FAILED_DELIVERY': 'Failed Delivery',
  'CANCELED': 'Canceled'
};

/**
 * Format status for display
 * Replaces underscores with spaces and returns the internationalized value
 */
export const formatStatus = (status: string): string => {
  return statusI18n[status] || status;
};

/**
 * Format status for CSS class name
 * Replaces underscores with hyphens and converts to lowercase
 */
export const formatStatusForClassName = (status: string): string => {
  return status.toLowerCase().replace(/_/g, '-');
}; 