import { useMemo } from 'react';

interface Payment {
  amount: number;
  date: string;
}

interface PaymentStatsProps {
  payments: Payment[];
}

export default function PaymentStats({ payments }: PaymentStatsProps) {
  const stats = useMemo(() => {
    const yearlyStats: { [key: string]: number } = {};
    const monthlyStats: { [key: string]: number } = {};

    payments.forEach(payment => {
      const date = new Date(payment.date);
      const year = date.getFullYear();
      const month = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      yearlyStats[year] = (yearlyStats[year] || 0) + payment.amount;
      monthlyStats[month] = (monthlyStats[month] || 0) + payment.amount;
    });

    return {
      yearly: Object.entries(yearlyStats).sort((a, b) => Number(b[0]) - Number(a[0])),
      monthly: Object.entries(monthlyStats)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .slice(0, 12) // 최근 12개월만 표시
    };
  }, [payments]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* 연간 통계 */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">연간 통계</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">연도</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">총액</th>
              </tr>
            </thead>
            <tbody>
              {stats.yearly.map(([year, total]) => (
                <tr key={year} className="border-b">
                  <td className="px-4 py-2 text-gray-900">{year}년</td>
                  <td className="px-4 py-2 text-right text-gray-900">
                    {total.toLocaleString()}원
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 월간 통계 */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">월간 통계</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">년월</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">총액</th>
              </tr>
            </thead>
            <tbody>
              {stats.monthly.map(([month, total]) => (
                <tr key={month} className="border-b">
                  <td className="px-4 py-2 text-gray-900">{month}</td>
                  <td className="px-4 py-2 text-right text-gray-900">
                    {total.toLocaleString()}원
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
