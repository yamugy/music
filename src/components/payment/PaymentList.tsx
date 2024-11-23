import { Payment } from '@/types/models';
import { BaseListProps, SortConfig, SortDirection } from '@/types/common';
import { useState, useEffect, useMemo } from 'react';
import { fetchData, deleteData } from '@/utils/api';
import { formatDate, formatCurrency } from '@/utils/formatters';

type PaymentSortKeys = keyof Omit<Payment, 'student' | 'createdAt' | 'updatedAt'>;

interface PaymentListProps extends BaseListProps {
  onEdit: (payment: Payment) => void;
  onPaymentsLoad: (payments: Payment[]) => void;
}

export default function PaymentList({ refreshTrigger, onEdit, onPaymentsLoad }: PaymentListProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<SortConfig<Payment>>({ 
    key: 'date', 
    direction: 'desc' 
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedStudent, setSelectedStudent] = useState<number | 'all'>('all');
  const [students, setStudents] = useState<{id: number, name: string}[]>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await fetchData<Payment[]>('/api/payments');
        setPayments(data);
        onPaymentsLoad(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, [refreshTrigger, onPaymentsLoad]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students');
        if (!response.ok) throw new Error('학생 목록을 불러오는데 실패했습니다.');
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchStudents();
  }, []);

  const handleDelete = async (paymentId: number) => {
    if (!confirm('정말 이 결제 내역을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('결제 내역 삭제에 실패했습니다.');
      
      // 목록 새로고침
      const updatedPayments = payments.filter(payment => payment.id !== paymentId);
      setPayments(updatedPayments);
    } catch (error) {
      console.error('Delete error:', error);
      alert('결제 내역 삭제 중 오류가 발생했습니다.');
    }
  };

  // 필터링 및 정렬된 결제 데이터 계산
  const filteredAndSortedPayments = useMemo(() => {
    let filtered = payments;
    
    // 학생별 필터링
    if (selectedStudent !== 'all') {
      filtered = payments.filter(payment => payment.studentId === selectedStudent);
    }

    // 정렬 로직 적용
    if (!sortConfig.key) return filtered;
    
    return [...filtered].sort((a, b) => {
      if (sortConfig.key === 'date') {
        const dateA = new Date(a[sortConfig.key]).getTime();
        const dateB = new Date(b[sortConfig.key]).getTime();
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc' 
          ? a[sortConfig.key] - b[sortConfig.key]
          : b[sortConfig.key] - a[sortConfig.key];
      }
      // 문자열 비교
      const valueA = String(a[sortConfig.key]);
      const valueB = String(b[sortConfig.key]);
      return sortConfig.direction === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  }, [payments, selectedStudent, sortConfig]);

  // 현재 페이지의 데이터
  const currentPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedPayments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedPayments, currentPage]);

  // 정렬 핸들러 수정
  const handleSort = (key: PaymentSortKeys) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // 학생별 총액 계산
  const studentTotals = useMemo(() => {
    if (selectedStudent === 'all') return null;
    
    return filteredAndSortedPayments.reduce((total, payment) => total + payment.amount, 0);
  }, [filteredAndSortedPayments, selectedStudent]);

  // 날짜 포맷 헬퍼 함수 추가
  const formatDate = (date: string): string => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  if (isLoading) return <div className="text-center py-4">로딩 중...</div>;
  if (payments.length === 0) return <div className="text-center py-4">결제 내역이 없습니다.</div>;

  return (
    <div className="space-y-4">
      {/* 필터링 옵션 */}
      <div className="flex justify-between items-center bg-white p-2 rounded-lg shadow"> {/* p-4에서 p-2로 변경 */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">학생 선택:</label>
            <select
              value={selectedStudent}
              onChange={(e) => {
                setSelectedStudent(e.target.value === 'all' ? 'all' : Number(e.target.value));
                setCurrentPage(1);
              }}
              className="text-base rounded-md border-gray-300 shadow-sm px-4 py-2"
            >
              <option value="all">전체 학생</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>{student.name}</option>
              ))}
            </select>
          </div>
          {studentTotals !== null && (
            <div className="text-base font-medium text-gray-700">
              총 결제액: <span className="text-primary">{studentTotals.toLocaleString()}원</span>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                { key: 'date' as const, label: '날짜' },
                { key: 'studentId' as const, label: '학생명' },
                { key: 'amount' as const, label: '결제금액' },
                { key: 'method' as const, label: '결제방법' },
                { key: 'memo' as const, label: '메모' }
              ].map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-6 py-3 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>{label}</span>
                    {sortConfig.key === key && (
                      <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                  {formatDate(payment.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-base font-semibold text-gray-900 bg-pink-50">
                  {payment.student.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                  {payment.amount.toLocaleString()}원
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                  {payment.method}
                </td>
                <td className="px-6 py-4 text-center text-sm text-gray-700 break-words min-w-[120px] max-w-[200px]">
                  {payment.memo || '-'}
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(payment)}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(payment.id)}
                      className="px-2 py-1 text-xs bg-pink-100 text-pink-600 rounded hover:bg-pink-200"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-between items-center px-1"> {/* px-4에서 px-1로 변경 */}
        <div className="text-sm text-gray-700">
          전체 {payments.length}개 중 {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, payments.length)}개 표시
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            이전
          </button>
          <button
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={currentPage * itemsPerPage >= payments.length}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}