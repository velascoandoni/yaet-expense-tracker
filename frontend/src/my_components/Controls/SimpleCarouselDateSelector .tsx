import { useEffect, useRef, useState } from 'react';
import { Row, Button } from 'antd';
import dayjs from 'dayjs';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

export default function SimpleCarouselDateSelector ({ payDayIntervals, setQuery, query}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleItems = 3;

  // Find current selected index
  const getSelectedIndex = () => {
    if (!query?.startDate || !payDayIntervals) return -1;
    return payDayIntervals.findIndex(
      interval => interval.startDate === query.startDate && interval.endDate === query.endDate
    );
  };

  const selectedIndex = getSelectedIndex();
  
  // Get visible intervals
  const visibleIntervals = payDayIntervals?.slice(
    currentIndex, 
    currentIndex + visibleItems
  ) || [];

  // Handle previous button - selects previous item
  const handlePrevious = () => {
    if (selectedIndex > 0) {
      const newIndex = selectedIndex - 1;
      const prevInterval = payDayIntervals[newIndex];
      setQuery(q => ({ ...q, startDate: prevInterval.startDate, endDate: prevInterval.endDate }));
      
      // Scroll if needed
      if (newIndex < currentIndex) {
        setCurrentIndex(newIndex);
      }
    }
  };

  // Handle next button - selects next item
  const handleNext = () => {
    if (selectedIndex < payDayIntervals.length - 1) {
      const newIndex = selectedIndex + 1;
      const nextInterval = payDayIntervals[newIndex];
      setQuery(q => ({ ...q, startDate: nextInterval.startDate, endDate: nextInterval.endDate }));
      
      // Scroll if needed
      if (newIndex >= currentIndex + visibleItems) {
        setCurrentIndex(newIndex - visibleItems + 1);
      }
    }
  };

  // Handle direct click on a date button
  const handleDateSelect = (startDate, endDate, indexInVisible) => {
    const actualIndex = currentIndex + indexInVisible;
    setQuery(q => ({ ...q, startDate, endDate }));
    
    // If clicked item is at edge and there are more items, scroll a bit
    if (indexInVisible === 0 && actualIndex > 0) {
      setCurrentIndex(Math.max(0, actualIndex - 1));
    } else if (indexInVisible === visibleItems - 1 && actualIndex < payDayIntervals.length - 1) {
      setCurrentIndex(Math.min(payDayIntervals.length - visibleItems, actualIndex - 1));
    }
  };

  if (!payDayIntervals || payDayIntervals.length === 0) {
    return null;
  }

  // Check if selected is in current view
  const isSelectedInView = selectedIndex >= currentIndex && selectedIndex < currentIndex + visibleItems;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Button
        type="text"
        icon={<LeftOutlined />}
        onClick={handlePrevious}
        disabled={selectedIndex <= 0}
      />
      
      <Row gutter={[8, 8]} style={{ margin: '0 16px', minWidth: '300px' }}>
        {visibleIntervals.map(({ startDate, endDate }, indexInVisible) => {
          const end = dayjs(endDate);
          const selected = selectedIndex === currentIndex + indexInVisible;
          
          return (
            <Button 
              key={`${startDate}-${endDate}`}
              onClick={() => handleDateSelect(startDate, endDate, indexInVisible)}
              style={{ 
                minWidth: '100px',
                borderColor: selected ? '#1890ff' : undefined,
                borderWidth: selected ? '2px' : undefined,
                backgroundColor: selected ? '#e6f7ff' : undefined,
                fontWeight: selected ? '600' : 'normal',
              }}
            >
              {end.format('MMM YYYY')}
            </Button>
          );
        })}
      </Row>
      
      <Button
        type="text"
        icon={<RightOutlined />}
        onClick={handleNext}
        disabled={selectedIndex >= payDayIntervals.length - 1}
      />
    </div>
  );
};