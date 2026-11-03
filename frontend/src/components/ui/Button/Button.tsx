interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

function Button({
  children,
  type = "button",
  disabled = false,
  className = "",
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
