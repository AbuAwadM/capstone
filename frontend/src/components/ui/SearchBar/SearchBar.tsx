import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  placeholder?: string;
  className?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

function SearchBar({
  value,
  placeholder = "Search",
  className = "",
  onChange,
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search
        size={18}
        strokeWidth={1.5}
        aria-hidden="true"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <input
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={onChange}
        className="w-full py-2 pl-10 pr-3 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
    </div>
  );
}

export default SearchBar;
