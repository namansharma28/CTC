/**
 * Date utility functions for consistent formatting across the application
 */

/**
 * Format date to DD/MM/YYYY format
 * @param date - Date string or Date object
 * @returns Formatted date string in DD/MM/YYYY format
 */
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return 'Unknown';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return 'Unknown';
    
    return dateObj.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return 'Unknown';
  }
};

/**
 * Format date to DD/MM/YYYY format with fallback
 * @param date - Date string or Date object
 * @param fallback - Fallback text if date is invalid
 * @returns Formatted date string or fallback
 */
export const formatDateWithFallback = (date: string | Date | null | undefined, fallback: string = 'Not specified'): string => {
  if (!date) return fallback;
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return fallback;
    
    return dateObj.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return fallback;
  }
};