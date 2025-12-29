import React, { forwardRef } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options = [], error, className, ...rest }, ref) => {
    return (
      <div className="flex flex-row justify-start text-sm items-center">
        <label htmlFor={label} className="min-w-48">
          {label}
          {rest.required && <span className="text-red-500">*</span>}
        </label>

        <span className="text-xl">:</span>

        <div className="w-full flex flex-col">
          <select
            {...rest}
            ref={ref}
            aria-invalid={!!error}
            className={`bg-gray-300 max-w-52 focus:bg-black focus:text-white border w-full outline-none transition-colors text-[var(--text)] ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-100"
                : "border-muted focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
            } ${className ?? ""}`}
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
