interface ButtonProps {
  children: React.ReactNode;
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "success" | "danger" | "clear" | "black";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

const sizeClasses = {
  small: "h-8 px-3 gap-1.5 text-sm rounded-md",
  medium: "h-10 px-4 gap-2 text-sm rounded-lg",
  large: "h-12 px-6 gap-2.5 text-base rounded-lg",
};

const colorClasses = {
  primary: "bg-blue-500 text-white hover:bg-blue-600",
  secondary: "bg-gray-500 text-white hover:bg-gray-600",
  success: "bg-green-500 text-white hover:bg-green-600",
  danger: "bg-red-500 text-white hover:bg-red-600",
  clear: "text-gray-800 hover:bg-gray-100",
  black: "bg-black text-white hover:bg-gray-800",
};

function Button({
  children,
  size = "small",
  color = "primary",
  onClick,
  type,
  className = "",
}: ButtonProps) {
  return (
    <button
      className={`${sizeClasses[size]} ${colorClasses[color]} inline-flex items-center justify-center whitespace-nowrap border border-gray-300 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${className}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

export default Button;
