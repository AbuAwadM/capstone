type Variant = "primary" | "secondary" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  onClick,
}: ButtonProps) {
  const variantClass =
    variant === "outline" ? "btn-outline-primary" : `btn-${variant}`;
  const sizeClass = size === "md" ? "" : `btn-${size}`;

  return (
    <button
      type={type}
      className={`btn ${variantClass} ${sizeClass}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
