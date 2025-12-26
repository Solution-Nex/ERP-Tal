
interface FieldProps {
  label: string;
  value?: string;
  type: string;
  reqired?: boolean;
  onChange?: (value: string) => void;
}

const Field = ({
  label,
  value = "",
  type = "",
  reqired = false,
  onChange,
}: FieldProps) => {
  return (
    <div className="grid grid-cols-[300px_10px_1fr] items-center text-md py-0.5">
      <label htmlFor={label}><b>{label}</b></label>
      <span className="text-xl"><b>:</b></span>

      <input
        type={type}
        defaultValue={value}
        required={reqired}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange && onChange(e.target.value)}
        className="bg-surface border border-muted px-3 py-2 rounded-sm outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-colors text-[var(--text)]"
      />
    </div>
  );
};

export default Field;
