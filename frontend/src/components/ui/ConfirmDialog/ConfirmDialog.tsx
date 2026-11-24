import { useEffect, useId, useRef } from "react";
import Button from "@/components/ui/Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** "danger" makes the confirm button red, for destructive actions like delete. */
  tone?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "primary",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const messageId = useId();

  // Open/close the native <dialog> to match the `open` prop.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={messageId}
      // Esc key closes a native dialog — treat it as cancel.
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      // Clicking the dimmed backdrop (the dialog element itself, outside the panel) cancels.
      onClick={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
      className="w-full max-w-sm p-0 m-auto bg-transparent backdrop:bg-black/40"
    >
      <div className="p-5 bg-white rounded-lg shadow-lg">
        <h2 id={titleId} className="text-base font-semibold text-gray-900">
          {title}
        </h2>
        <p id={messageId} className="mt-2 text-sm text-gray-600">
          {message}
        </p>
        <div className="flex justify-end gap-2 mt-5">
          <Button type="button" color="clear" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button type="button" color={tone} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}

export default ConfirmDialog;
