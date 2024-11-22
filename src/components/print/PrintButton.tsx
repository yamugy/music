/* 프린트 버튼 컴포넌트 */
import React from 'react';
import { handlePrint } from '@/utils/printUtils';

interface PrintButtonProps {
  targetId: string;
  label: string;
  className?: string;
  onClick?: () => void;
}

const PrintButton: React.FC<PrintButtonProps> = ({ 
  targetId, 
  label, 
  className = '',
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className={`bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md no-print ${className}`}
    >
      {label}
    </button>
  );
};

export default PrintButton;