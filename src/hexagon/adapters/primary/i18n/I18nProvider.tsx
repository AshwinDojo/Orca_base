import React, { createContext, useContext, ReactNode } from 'react';

interface I18nContextType {
  formatStatus: (status: string) => string;
  formatStatusForClassName: (status: string) => string;
  formatDate: (date: Date) => string;
  translate: (key: string, params?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const formatStatus = (status: string): string => {
    // Simple implementation that formats status for display
    const statusMap: Record<string, string> = {
      'CREATED': 'Created',
      'PROCESSING': 'Processing',
      'IN_TRANSIT': 'In Transit',
      'OUT_FOR_DELIVERY': 'Out for Delivery',
      'PICKED_UP': 'Picked Up',
      'DELIVERED': 'Delivered',
      'FAILED_DELIVERY': 'Failed Delivery',
      'CANCELED': 'Canceled'
    };
    
    return statusMap[status] || status;
  };
  
  const formatStatusForClassName = (status: string): string => {
    // Convert to lowercase and replace underscores with hyphens for CSS classes
    return status.toLowerCase().replace(/_/g, '-');
  };
  
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString();
  };
  
  const translate = (key: string, params?: Record<string, string>): string => {
    // Simple implementation, in a real app this would use i18next or similar
    if (!params) return key;
    
    let translatedText = key;
    for (const [param, value] of Object.entries(params)) {
      translatedText = translatedText.replace(`{{${param}}}`, value);
    }
    
    return translatedText;
  };
  
  const value = {
    formatStatus,
    formatStatusForClassName,
    formatDate,
    translate
  };
  
  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}; 