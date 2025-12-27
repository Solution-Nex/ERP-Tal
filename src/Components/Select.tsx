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
    <div className="flex flex-row justify-start align-middle border-b border-gray-300 text-md py-0.5">
      <label htmlFor={label} className="w-60">
        <b>{label}</b>
      </label>

      {/* <div className="flex flex-row align-middle"> */}
        <span className="text-xl">
          <b>:</b>
        </span>

        <select
          defaultValue={value}
          onChange={(e:React.ChangeEvent<HTMLSelectElement>) => onChange && onChange(e.target.value)}
          className="bg-surface border w-full border-muted px-3 py-2 rounded-sm outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-colors text-[var(--text)]"
        >
          {options.map((opt, index) => (
            <option key={index} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    // </div>
  );
};

export default Select;
