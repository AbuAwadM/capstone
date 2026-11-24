import { ChevronDown } from "lucide-react";

export interface DropDownOption {
  value: string;
  label: string;
}

interface DropDownProps {
  value: string;
  options: DropDownOption[];
  placeholder?: string;
  className?: string;
  onChange: (value: string) => void;
}

function DropDown({
  value,
  options,
  placeholder = "Select",
  className = "",
  onChange,
}: DropDownProps) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        aria-label={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full py-2 pl-3 pr-10 text-sm bg-white border border-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 ${
          value === "" ? "text-gray-400" : "text-gray-900"
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-gray-900">
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={18}
        strokeWidth={1.5}
        aria-hidden="true"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );
}

export default DropDown;
