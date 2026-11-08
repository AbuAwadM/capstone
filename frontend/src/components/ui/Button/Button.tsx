interface ButtonProps {
  children: React.ReactNode;
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "success" | "danger" | "clear" | "black";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

const sizeClasses = {
  small: "px-2 py-1 text-sm",
  medium: "px-4 py-2 text-base",
  large: "px-6 py-3 text-lg",
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
      className={`${sizeClasses[size]} ${colorClasses[color]} rounded-lg border border-gray-300 font-medium ${className}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

export default Button;
