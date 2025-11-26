
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, name, ...props }) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-2 text-sm font-medium text-gray-300">{label}</label>
      <input
        id={name}
        name={name}
        className="bg-gray-700/50 border border-gray-500 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none transition duration-300 placeholder-gray-400"
        {...props}
      />
    </div>
  );
};

export default Input;
