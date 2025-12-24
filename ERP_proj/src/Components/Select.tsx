import React from "react";

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
      <label htmlFor={label}>{label}</label>
      <span>:</span>

        <select
          defaultValue={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          className="bg-[#d8f5d2] outline-none px-1 focus:bg-black focus:text-white"
        >
          {options.map((opt, index) => (
            <option key={index} value={opt} >
              {opt}
            </option>
          ))}
        </select>
    </div>
  );
};

export default Select;
