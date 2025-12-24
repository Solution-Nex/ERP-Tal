import React from "react";

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
      <label htmlFor={label}>{label}</label>
      <span>:</span>

      <input
        type={type}
        defaultValue={value}
        required={reqired}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="bg-[#d8f5d2] outline-none px-1 focus:bg-black focus:text-white"
      />
    </div>
  );
};

export default Field;
