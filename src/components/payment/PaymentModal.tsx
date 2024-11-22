import { useState, useEffect } from 'react';
import Modal from '@/components/common/Modal';

const PAYMENT_METHODS = ['현금', '무통장입금', '카드'];

interface Student {
  id: number;
  name: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  payment?: {
    id: number;
    studentId: number;
    amount: number;
    method: string;
    date: string;
    memo?: string;
  };
}

export default function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  payment
}: PaymentModalProps) {
  // 날짜를 yyyy-MM-dd 형식으로 변환하는 헬퍼 함수
  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const [students, setStudents] = useState<Student[]>([]);
  const [formData, setFormData] = useState({
    studentId: payment?.studentId || '',
    amount: payment?.amount || '',
    method: payment?.method || PAYMENT_METHODS[0],
    date: payment?.date ? formatDate(payment.date) : formatDate(new Date()),
    memo: payment?.memo || ''
  });

  // payment prop이 변경될 때마다 formData 초기화
  useEffect(() => {
    setFormData({
      studentId: payment?.studentId || '',
      amount: payment?.amount || '',
      method: payment?.method || PAYMENT_METHODS[0],
      date: payment?.date 
        ? formatDate(payment.date)
        : formatDate(new Date()),
      memo: payment?.memo || ''
    });
  }, [payment]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students');
        if (!response.ok) throw new Error('학생 목록을 불러오는데 실패했습니다.');
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Error:', error);
        alert('학생 목록을 불러오는데 실패했습니다.');
      }
    };

    fetchStudents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const processedData = {
        ...formData,
        studentId: Number(formData.studentId),
        amount: Number(formData.amount),
        date: formatDate(formData.date) // 제출 시에도 날짜 형식 통일
      };

      const url = payment ? `/api/payments/${payment.id}` : '/api/payments';
      const response = await fetch(url, {
        method: payment ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '결제 처리 중 오류가 발생했습니다.');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Payment error:', error);
      alert(error instanceof Error ? error.message : '결제 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={payment ? "결제 수정" : "새 결제 등록"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">학생</label>
          <select
            value={formData.studentId}
            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          >
            <option value="">학생 선택</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">결제금액</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">결제방법</label>
          <select
            value={formData.method}
            onChange={(e) => setFormData({ ...formData, method: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          >
            {PAYMENT_METHODS.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">결제일</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">메모</label>
          <textarea
            value={formData.memo}
            onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-primary rounded-md hover:bg-secondary"
          >
            {payment ? '수정' : '등록'}
          </button>
        </div>
      </form>
    </Modal>
  );
}