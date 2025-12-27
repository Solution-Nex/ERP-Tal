
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
    <div className="flex flex-row justify-start align-middle items-center text-md py-1 border-b border-gray-300">
      <label htmlFor={label} className="w-60">
        <b>{label}</b>
      </label>
      {/* <div className=""> */}
        <span className="text-xl">
          <b>:</b>
        </span>
        <input
          type={type}
          defaultValue={value}
          required={reqired}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange && onChange(e.target.value)
          }
          className="bg-surface border border-muted px-3 py-2 rounded-sm outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-colors text-[var(--text)] w-full"
        />
      {/* </div> */}
    </div>
  );
};

export default Field;
