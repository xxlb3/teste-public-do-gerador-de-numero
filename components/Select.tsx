import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({ label, name, options, placeholder = "Selecione...", ...props }) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-2 text-sm font-medium text-gray-300">{label}</label>
      <select
        id={name}
        name={name}
        className="bg-gray-700/50 border border-gray-500 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none transition duration-300 appearance-none"
        {...props}
      >
        {options.map(option => (
          <option key={option} value={option} disabled={option === ""} className="bg-gray-800 text-white">
            {option === "" ? placeholder : option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;