import { useEffect, useState } from 'react';

interface Student {
  id: number;
  name: string;
  phone: string;    // contact -> phone
  subject: string;  // 추가
  note: string;     // memo -> note
}

interface StudentListProps {
  onEdit: (student: any) => void;
  refreshTrigger: number;
  className?: string;
}

export default function StudentList({ onEdit, refreshTrigger, className }: StudentListProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      const res = await fetch('/api/students');
      const data = await res.json();
      setStudents(data);
      setFilteredStudents(data);
    };

    fetchStudents();
  }, [refreshTrigger]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = students.filter(student =>
      student.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  const handleDelete = async (studentId: number) => {
    if (!confirm('정말 삭제하시겠습니까? 관련된 모든 수업과 결제 정보도 함께 삭제됩니다.')) {
      return;
    }

    try {
      const res = await fetch(`/api/students/${studentId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('삭제 실패');
      
      // 목록 새로고침
      const updatedStudents = students.filter(student => student.id !== studentId);
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={className}>
      <div className="mb-4">
        <input
          type="text"
          placeholder="학생 이름으로 검색"
          className="w-full max-w-md px-4 py-2 border rounded-lg"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-3 text-center text-sm font-bold text-gray-900 uppercase">이름</th>
              <th className="px-2 py-3 text-center text-sm font-bold text-gray-900 uppercase">연락처</th>
              <th className="px-2 py-3 text-center text-sm font-bold text-gray-900 uppercase">수강과목</th>
              <th className="px-2 py-3 text-center text-sm font-bold text-gray-900 uppercase">메모</th>
              <th className="px-2 py-3 text-center text-sm font-bold text-gray-900 uppercase">관리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-2 py-4 whitespace-nowrap text-center font-semibold text-gray-900 bg-pink-50">
                  {student.name}
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-center">{student.phone || '-'}</td>
                <td className="px-2 py-4 whitespace-nowrap text-center">{student.subject || '-'}</td>
                <td className="px-2 py-4 text-center">{student.note || '-'}</td>
                <td className="px-2 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(student)}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
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
    </div>
  );
}