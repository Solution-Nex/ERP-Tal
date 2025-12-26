interface SelectProps {
  label: string;
  value: string;
  options: string[];
  onChange?: (value: string) => void;
}

const Select = ({
  label,
  value = "",
  options = [],
  onChange
}: SelectProps) => {
  return (
    <div className="grid grid-cols-[300px_10px_1fr] items-center text-md py-0.5">
      <label htmlFor={label}>
        <b>{label}</b>
      </label>
      <span className="text-xl">
        <b>:</b>
      </span>

      <select
        defaultValue={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="bg-surface border border-muted px-3 py-2 rounded-sm outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-colors text-[var(--text)]"
      >
        {options.map((opt, index) => (
          <option key={index} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
