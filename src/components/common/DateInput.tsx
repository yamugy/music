
import { formatDate } from '@/lib/utils';

interface DateInputProps {
  value: string | Date;
  onChange: (value: string) => void;
  className?: string;
}

export default function DateInput({ value, onChange, className = '' }: DateInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <input
      type="date"
      value={typeof value === 'string' ? value : formatDate(value)}
      onChange={handleChange}
      className={`px-3 py-2 border rounded-lg ${className}`}
    />
  );
}