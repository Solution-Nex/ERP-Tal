import React, { forwardRef, useState } from "react";


interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, error, className, type = "text", ...rest }, ref) => {
    const [viewPassword, setViewPassword] = useState<boolean>(false);

    const isPassword = type === "password";

    return (
      <div className="flex flex-row justify-start align-middle items-start text-md py-1 border-b border-gray-300">
        <label htmlFor={label} className="w-60">
          <b>{label}</b>
          {rest.required && <span className="text-red-500">*</span>}
        </label>
        <span className="text-xl mt-2">
          <b>:</b>
        </span>
        <div className="w-full flex flex-col">
          <input
            {...rest}
            ref={ref}
            type={isPassword ? (viewPassword ? "text" : "password") : type}
            aria-invalid={!!error}
            className={`bg-surface border px-3 py-2 rounded-sm outline-none transition-colors text-[var(--text)] w-full ${error ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-100' : 'border-muted focus:border-blue-400 focus:ring-1 focus:ring-blue-400'} ${className ?? ''}`}
          />

          {isPassword && rest.value && (
            <button
              type="button"
              onClick={() => setViewPassword(!viewPassword)}
              className="mt-2 text-sm text-blue-500 hover:underline"
            >
              {viewPassword ? "Hide" : "Show"}
            </button>
          )}
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      </div>
    );
  }
);

Field.displayName = "Field";

export default Field;
