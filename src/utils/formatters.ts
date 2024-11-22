export const formatDate = (date: Date | string): string => {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString()}원`;
};