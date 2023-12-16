"use client";

import { ComponentType, useEffect, useRef } from "react";

export default function DialogHandler({
  DialogComponent,
  params,
  onDialogRef,
}: {
  DialogComponent: ComponentType<any>;
  params: any;
  onDialogRef: (ref: HTMLDialogElement) => void;
}) {
  const dialogRef = useRef(null);
  useEffect(() => {
    if (dialogRef.current) {
      onDialogRef(dialogRef.current);
    }
  }, [dialogRef, params, onDialogRef]);

  if (!params) return null;
  return <DialogComponent ref={dialogRef} {...params} />;
}
