import { useState } from "react";

interface FieldProps {
  label: string;
  value?: string;
  type: string;
  required?: boolean;
  onChange?: (value: string) => void;
}

const Field = ({
  label,
  value = "",
  type = "",
  required = false,
  onChange,
}: FieldProps) => {
  const [viewPassword, setViewPassword] = useState<boolean>(false);
  return (
    <div className="flex flex-row justify-start align-middle items-center text-md py-1 border-b border-gray-300">
      <label htmlFor={label} className="w-60">
        <b>{label}</b>
        {required && <span className="text-red-500">*</span>}
      </label>
      <span className="text-xl">
        <b>:</b>
      </span>
      <input
        type={type === "password" ? (viewPassword ? "text" : "password") : type}
        value={value}
        required={required}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange && onChange(e.target.value)
        }
        className="bg-surface border border-muted px-3 py-2 rounded-sm outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-colors text-[var(--text)] w-full"
      />
      {type === "password" && (
        <button
          type="button"
          onClick={() => setViewPassword(!viewPassword)}
          className="ml-2 text-sm text-[var(--primary)]"
        >
          {viewPassword ? "Hide" : "Show"}
        </button>
      )}
    </div>
  );
};

export default Field;
