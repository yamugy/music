
import { useState, useEffect } from 'react';

export default function BackupStatus() {
  const [lastBackup, setLastBackup] = useState<string | null>(null);

  useEffect(() => {
    // localStorage에서 마지막 백업 시간 가져오기
    const saved = localStorage.getItem('lastBackup');
    if (saved) {
      setLastBackup(saved);
    }
  }, []);

  return lastBackup ? (
    <div className="text-sm text-gray-600">
      마지막 백업: {new Date(lastBackup).toLocaleString()}
    </div>
  ) : null;
}