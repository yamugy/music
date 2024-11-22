import React, { useState, useEffect } from 'react';
import { Student, Lesson, Payment } from '@prisma/client';
import PrintLayout from './PrintLayout';
import { formatPrintDate, formatCurrency } from '@/utils/printUtils';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrintModal: React.FC<PrintModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 학생 검색
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      const res = await fetch(`/api/students/search?query=${query}`);
      const data = await res.json();
      setStudents(data);
    } else {
      setStudents([]);
    }
  };

  // 학생 선택시 데이터 로드
  useEffect(() => {
    const loadStudentData = async () => {
      if (!selectedStudent) return;
      
      setIsLoading(true);
      try {
        // 수업 이력 로드 - 전체 데이터
        const lessonsRes = await fetch(
          `/api/lessons/search?studentId=${selectedStudent.id}`
        );
        const lessonsData = await lessonsRes.json();
        setLessons(lessonsData);

        // 결제 이력 로드 - 전체 데이터
        const paymentsRes = await fetch(
          `/api/payments/search?studentId=${selectedStudent.id}`
        );
        const paymentsData = await paymentsRes.json();
        setPayments(paymentsData);
      } catch (error) {
        console.error('데이터 로드 중 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudentData();
  }, [selectedStudent]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">학생 정보 프린트</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {!selectedStudent ? (
          <div className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="학생 이름으로 검색"
              className="w-full p-2 border rounded"
            />
            <div className="mt-2 max-h-[300px] overflow-y-auto">
              {students.map((student) => (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className="p-2 hover:bg-gray-100 cursor-pointer border-b"
                >
                  {student.name} - {student.subject}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div id="student-print-content">
            <PrintLayout title={`${selectedStudent.name} 학생 정보`}>
              {isLoading ? (
                <div className="text-center py-4">데이터 로딩 중...</div>
              ) : (
                <>
                  <table className="w-full border-collapse mb-8">
                    <tbody>
                      <tr className="border-b">
                        <th className="py-2 px-4 bg-gray-50 text-left w-1/4">이름</th>
                        <td className="py-2 px-4">{selectedStudent.name}</td>
                        <th className="py-2 px-4 bg-gray-50 text-left w-1/4">연락처</th>
                        <td className="py-2 px-4">{selectedStudent.phone}</td>
                      </tr>
                      <tr className="border-b">
                        <th className="py-2 px-4 bg-gray-50 text-left">과목</th>
                        <td className="py-2 px-4">{selectedStudent.subject}</td>
                        <th className="py-2 px-4 bg-gray-50 text-left">메모</th>
                        <td className="py-2 px-4">{selectedStudent.note || '-'}</td>
                      </tr>
                    </tbody>
                  </table>

                  <h3 className="text-lg font-semibold mt-6 mb-3">최근 수업 이력</h3>
                  <table className="w-full border-collapse mb-8">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-2 px-4 border">날짜</th>
                        <th className="py-2 px-4 border">시간</th>
                        <th className="py-2 px-4 border">내용</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lessons.map((lesson) => (
                        <tr key={lesson.id} className="border">
                          <td className="py-2 px-4">{formatPrintDate(lesson.date)}</td>
                          <td className="py-2 px-4">{lesson.time}</td>
                          <td className="py-2 px-4">{lesson.content || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <h3 className="text-lg font-semibold mt-6 mb-3">최근 결제 이력</h3>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-2 px-4 border">날짜</th>
                        <th className="py-2 px-4 border">금액</th>
                        <th className="py-2 px-4 border">결제방법</th>
                        <th className="py-2 px-4 border">메모</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id} className="border">
                          <td className="py-2 px-4">{formatPrintDate(payment.date)}</td>
                          <td className="py-2 px-4">{formatCurrency(payment.amount)}</td>
                          <td className="py-2 px-4">{payment.method}</td>
                          <td className="py-2 px-4">{payment.memo || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </PrintLayout>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border rounded"
          >
            닫기
          </button>
          {selectedStudent && !isLoading && (
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
            >
              프린트
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrintModal;