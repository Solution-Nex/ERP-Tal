import React, { forwardRef, useState } from "react";


interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, error, className, type = "text", ...rest }, ref) => {
    const [viewPassword, setViewPassword] = useState<boolean>(false);

    const isPassword = type === "password";

    return (
      <div className="flex flex-row justify-start items-center text-md ">
        {label && (
          <label htmlFor={label} className="text-sm min-w-48">
            {label}
            {rest.required && <span className="text-red-500">*</span>}
          </label>
        )}
        <span className="text-xl">{label && ":"}</span>
        <div className="w-full flex flex-row items-center justify-start">
          <input
            {...rest}
            ref={ref}
            type={isPassword ? (viewPassword ? "text" : "password") : type}
            aria-invalid={!!error}
            className={`bg-gray-300 mr-5 focus:bg-black max-w-52 focus:text-white outline-none transition-colors text-[var(--text)] w-full ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-100"
                : "border-muted focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            } ${className ?? ""}`}
          />
          
          {isPassword &&(
            <button
              type="button"
              onClick={() => setViewPassword(!viewPassword)}
              className="text-sm text-blue-500 hover:underline"
            >
              {viewPassword ? "Hide" : "Show"}
            </button>
          )}
        </div>
      </div>
    );
  }
);

Field.displayName = "Field";

export default Field;
