import React from 'react';

function InputField({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
    className = "",
  }) {
    return (
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            border border-[var(--neutral-400,#A1A1A1)]
            bg-[var(--neutral-200,#E5E5E5)]
            rounded-[6px]
            px-[20px]
            text-base
            placeholder-gray-500
            ${className}
          `}
        />
      </div>
    );
  }  

export default InputField;
