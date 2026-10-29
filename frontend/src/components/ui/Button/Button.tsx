type Variant = "primary" | "secondary" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  children: string;
  variant?: Variant;
  size?: Size;
  type?: "button" | "submit";
}

function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
}: ButtonProps) {
  const variantClass = variant === "outline" ? "btn-outline-primary" : `btn-${variant}`;
  const sizeClass = size === "md" ? "" : `btn-${size}`;

  return (
    <button type={type} className={`btn ${variantClass} ${sizeClass}`}>
      {children}
    </button>
  );
}

export default Button;
