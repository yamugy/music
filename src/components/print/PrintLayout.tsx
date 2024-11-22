/* 프린트 레이아웃 컴포넌트 */
import React from 'react';
import { formatPrintDate } from '@/utils/printUtils';

interface PrintLayoutProps {
  title: string;
  children: React.ReactNode;
  showDate?: boolean;
}

const PrintLayout: React.FC<PrintLayoutProps> = ({ 
  title, 
  children, 
  showDate = true 
}) => {
  return (
    <div className="print-container">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">{title}</h1>
        {showDate && (
          <p className="text-gray-600 mt-2">
            {formatPrintDate(new Date())}
          </p>
        )}
      </div>
      <div className="print-content">
        {children}
      </div>
      <div className="text-center text-sm text-gray-500 mt-8 print-only">
        음악학원 관리 시스템
      </div>
    </div>
  );
};

export default PrintLayout;