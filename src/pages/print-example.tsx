/* 프린트 예시 페이지 */
import React from 'react';
import PrintLayout from '@/components/print/PrintLayout';
import PrintButton from '@/components/print/PrintButton';
import { formatCurrency } from '@/utils/printUtils';

const PrintExample: React.FC = () => {
  const sampleData = {
    studentName: '홍길동',
    subject: '피아노',
    amount: 300000,
    date: new Date()
  };

  return (
    <div className="p-4">
      <PrintButton 
        targetId="printable-content" 
        label="영수증 출력"
        className="mb-4"
      />
      
      <div id="printable-content">
        <PrintLayout title="수업료 영수증">
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span>학생명</span>
              <span>{sampleData.studentName}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>과목</span>
              <span>{sampleData.subject}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>금액</span>
              <span>{formatCurrency(sampleData.amount)}</span>
            </div>
          </div>
        </PrintLayout>
      </div>
    </div>
  );
};

export default PrintExample;