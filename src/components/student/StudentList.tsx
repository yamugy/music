import { Student } from '@/types/models';
import { BaseListProps, SortConfig } from '@/types/common';
import { fetchData, deleteData } from '@/utils/api';
import { useEffect, useState, useMemo } from 'react';

type StudentSortKeys = keyof Omit<Student, 'id' | 'createdAt' | 'updatedAt'>;

interface StudentListProps extends BaseListProps {
  onEdit: (student: Student) => void;
}

export default function StudentList({ onEdit, refreshTrigger, className }: StudentListProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig<Student>>({ 
    key: 'name', 
    direction: 'asc' 
  });

  useEffect(() => {
    const fetchStudents = async () => {
      const data = await fetchData<Student[]>('/api/students');
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
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteData(`/api/students/${studentId}`);
      const updatedStudents = students.filter(student => student.id !== studentId);
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleSort = (key: StudentSortKeys) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      const valueA = String(a[sortConfig.key]);
      const valueB = String(b[sortConfig.key]);
      return sortConfig.direction === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  }, [filteredStudents, sortConfig]);

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
              {[
                { key: 'name' as const, label: '이름' },
                { key: 'phone' as const, label: '연락처' },
                { key: 'subject' as const, label: '수강과목' },
                { key: 'note' as const, label: '메모' }
              ].map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-2 py-3 text-center text-sm font-bold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>{label}</span>
                    {sortConfig.key === key && (
                      <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-2 py-3 text-center text-sm font-bold text-gray-900 uppercase">관리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-2 py-4 whitespace-nowrap text-center font-bold text-gray-900 bg-pink-50">
                  {student.name}
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-center text-sm">{student.phone || '-'}</td>
                <td className="px-2 py-4 whitespace-nowrap text-center text-sm">{student.subject || '-'}</td>
                <td className="px-2 py-4 text-center text-sm">{student.note || '-'}</td>
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