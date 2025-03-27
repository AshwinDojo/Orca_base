import React, { useEffect, useRef, useCallback } from 'react';

interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
}

const InfiniteScroll = ({
  onLoadMore,
  hasMore,
  isLoading,
  children,
  className = ''
}: InfiniteScrollProps) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const scrollCallbackRef = useRef<(() => void) | null>(null);
  
  // Store the callback in a ref to avoid creating new observers when the callback changes
  scrollCallbackRef.current = onLoadMore;
  
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !isLoading) {
      console.log('Scroll trigger intersected - loading more data');
      scrollCallbackRef.current?.();
    }
  }, [hasMore, isLoading]);
  
  // Manual scroll check backup
  useEffect(() => {
    const checkScroll = () => {
      if (!hasMore || isLoading) return;
      
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      if (documentHeight - scrollPosition < 300) {
        console.log('Manual scroll check - loading more data');
        scrollCallbackRef.current?.();
      }
    };
    
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, [hasMore, isLoading]);
  
  // Intersection observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px 0px 300px 0px',
      threshold: 0.1
    });
    
    const currentTrigger = triggerRef.current;
    if (currentTrigger) {
      observer.observe(currentTrigger);
    }
    
    return () => {
      if (currentTrigger) {
        observer.unobserve(currentTrigger);
      }
    };
  }, [handleIntersection]);
  
  return (
    <div className={`w-full ${className}`}>
      {children}
      
      <div ref={triggerRef} className="py-6 w-full">
        {isLoading && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-500">Loading more items...</span>
          </div>
        )}
        {!hasMore && !isLoading && (
          <div className="text-center py-4 text-gray-500 text-sm italic">
            End of list reached
          </div>
        )}
      </div>
    </div>
  );
};

export default InfiniteScroll; 