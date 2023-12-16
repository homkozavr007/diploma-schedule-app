"use client";

import { forwardRef } from "react";

export interface ConfirmationDialogData {
  title: string;
  content: string | React.ReactNode;
  buttons: {
    label: string;
    value: string;
    className?: string;
  }[];
}

const ConfirmationDialog = forwardRef<
  HTMLDialogElement,
  ConfirmationDialogData
>(({ title, content, buttons }: ConfirmationDialogData, ref) => {
  return (
    <dialog id="user_place_delete_dialog" className="modal" ref={ref}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        {content}
        <div className="modal-action">
          <form method="dialog" className="space-x-4">
            {buttons.map(({ label, value, className }) => (
              <button
                key={value}
                className={`btn ${className ?? ""}`}
                value={value}
                type="submit"
              >
                {label}
              </button>
            ))}
          </form>
        </div>
      </div>
    </dialog>
  );
});

ConfirmationDialog.displayName = "ConfirmationDialog";

export default ConfirmationDialog;
