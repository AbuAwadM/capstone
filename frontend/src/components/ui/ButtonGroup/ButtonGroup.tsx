export interface ButtonGroupItem {
  label: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
}

interface ButtonGroupProps {
  buttons: ButtonGroupItem[];
  size?: "small" | "medium" | "large";
  className?: string;
}

const sizeClasses = {
  small: "py-1 px-3 text-sm",
  medium: "py-2 px-4 text-sm",
  large: "py-3 px-6 text-base",
};

const baseClasses =
  "bg-slate-800 text-center text-white transition-all shadow-md hover:shadow-lg hover:bg-slate-700 focus:bg-slate-700 focus:shadow-none active:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none";

// Returns the rounding/border classes for a button based on its position in the group.
function getPositionClasses(index: number, total: number): string {
  if (total === 1) return "rounded-md border border-transparent";
  if (index === 0) return "rounded-md rounded-r-none border border-transparent";
  if (index === total - 1)
    return "rounded-md rounded-l-none border border-transparent";
  return "rounded-none border-l border-r border-slate-700";
}

function ButtonGroup({
  buttons,
  size = "medium",
  className = "",
}: ButtonGroupProps) {
  return (
    <div className={`flex ${className}`} role="group">
      {buttons.map((button, index) => (
        <button
          key={index}
          type="button"
          onClick={button.onClick}
          disabled={button.disabled}
          aria-pressed={button.active}
          className={`${baseClasses} ${sizeClasses[size]} ${getPositionClasses(
            index,
            buttons.length,
          )} ${button.active ? "bg-slate-700" : ""}`}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}

export default ButtonGroup;
