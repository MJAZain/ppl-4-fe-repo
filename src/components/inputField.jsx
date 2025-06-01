import React from "react";

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  className = "",
  id,
  isRequired,
  error,
}) {
  const isNumeric = type === "number";

  const handleKeyDown = (e) => {
    if (isNumeric) {
      const invalidChars = ["e", "E", "+", "-", "."];
      if (invalidChars.includes(e.key)) {
        e.preventDefault();
      }
    }
  };

  const handleInput = (e) => {
    if (isNumeric) {
      let inputValue = e.target.value;
      if (/^0\d+/.test(inputValue)) {
        inputValue = inputValue.replace(/^0+/, "");
        e.target.value = inputValue;
        if (onChange) {
          onChange({ target: { name: e.target.name, value: inputValue } });
        }
      }
    }
  };

  const handleWheel = (e) => {
    if (isNumeric) {
      e.target.blur();
    }
  };

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={id}
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={id}
        name={id || label?.toLowerCase().replace(/\s+/g, "-")}
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onWheel={handleWheel}
        min={isNumeric ? 1 : undefined}
        placeholder={placeholder}
        className={`
          border ${
            error ? "border-red-500" : "border-[var(--neutral-400,#A1A1A1)]"
          }
          bg-[var(--neutral-200,#E5E5E5)]
          rounded-[6px]
          px-[20px] 
          py-2 
          text-base
          placeholder-gray-500
          w-full
          focus:outline-none focus:ring-1 ${
            error ? "focus:ring-red-500" : "focus:ring-blue-500"
          }
          ${className}
        `}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default InputField;
