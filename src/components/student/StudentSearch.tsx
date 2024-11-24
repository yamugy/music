import React, { useState, FC } from 'react';
import { PrismaClient } from '@prisma/client';

interface Student {
  id: number;
  name: string;
  phone: string;
  instrument: string;
}

const StudentSearch: FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<Student[]>([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/students/search?query=${searchTerm}`);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('학생 검색 중 오류 발생:', error);
    }
  };

  return (
    <div className="w-full max-w-md">
      <input
        type="text"
        placeholder="학생 이름 검색..."
        className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:border-pink-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="space-y-2">
        {students.map((student) => (
          <div
            key={student.id}
            className="p-3 bg-pink-50 rounded-md hover:bg-pink-100 cursor-pointer"
          >
            <div className="font-medium text-pink-900">{student.name}</div>
            <div className="text-sm text-pink-600">{student.instrument}</div>
            <div className="text-sm text-pink-500">{student.phone}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentSearch;