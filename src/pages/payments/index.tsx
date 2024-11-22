import { useState, useCallback } from 'react';
import { Payment } from '@/types/models';
import PaymentList from '@/components/payment/PaymentList';
import PaymentModal from '@/components/payment/PaymentModal';
import PaymentStats from '@/components/payment/PaymentStats';

export default function PaymentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | undefined>();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [payments, setPayments] = useState<Payment[]>([]);

  const handleSuccess = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden px-1"> {/* px-4에서 px-1로 변경 */}
      <div className="flex flex-col space-y-6">
        {/* 헤더 영역 */}
        <div className="flex items-center justify-between px-1"> {/* px-2에서 px-1로 변경 */}
          <h1 className="text-2xl font-bold text-pink-600">결제 관리</h1> {/* 스타일 변경 */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors"
          >
            결제 등록
          </button>
        </div>

        {/* 통계 컴포넌트 */}
        <PaymentStats payments={payments} />

        {/* 결제 목록 컴포넌트 */}
        <PaymentList
          refreshTrigger={refreshTrigger}
          onEdit={(payment) => {
            setSelectedPayment(payment);
            setIsModalOpen(true);
          }}
          onPaymentsLoad={setPayments}
        />
      </div>

      {/* 결제 모달 */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPayment(undefined);
        }}
        onSuccess={handleSuccess}
        payment={selectedPayment}
      />
    </div>
  );
}