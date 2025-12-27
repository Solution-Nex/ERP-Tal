import React, { forwardRef } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options = [], error, className, ...rest }, ref) => {
    return (
      <div className="flex flex-row justify-start align-middle border-b border-gray-300 text-md py-0.5 items-start">
        <label htmlFor={label} className="w-60">
          <b>{label}</b>
          {rest.required && <span className="text-red-500">*</span>}
        </label>

        <span className="text-xl mt-2">
          <b>:</b>
        </span>

        <div className="w-full flex flex-col">
          <select
            {...rest}
            ref={ref}
            aria-invalid={!!error}
            className={`bg-surface border w-full px-3 py-2 rounded-sm outline-none transition-colors text-[var(--text)] ${error ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-100' : 'border-muted focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]'} ${className ?? ''}`}
          >
            {options.map((opt, index) => (
              <option key={index} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
