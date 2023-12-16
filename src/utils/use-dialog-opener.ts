"use client";

import { useCallback, useRef, useState } from "react";
import { ComponentType } from "react";

interface DialogProps<T> {
  DialogComponent: ComponentType<T>;
  params: T;
}

export function useDialogOpener<T>() {
  const [dialogProps, setDialogProps] = useState<DialogProps<T> | null>(null);
  const resolver = useRef<((ref: HTMLDialogElement) => void) | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const onDialogRef = useCallback((ref: HTMLDialogElement) => {
    if (resolver.current) {
      resolver.current(ref);
      resolver.current = null;
    }
  }, []);

  const openDialog = useCallback(
    (
      DialogComponent: ComponentType<T>,
      initialParams: T
    ): Promise<string | null> => {
      return new Promise((resolve: (ref: HTMLDialogElement) => void) => {
        resolver.current = resolve;
        setDialogProps({ DialogComponent, params: initialParams });
      }).then((ref) => {
        dialogRef.current = ref;
        return new Promise((resolve: (value: any) => void) => {
          const onClose = () => {
            ref.removeEventListener("close", onClose);
            tearDown();
            resolve(ref.returnValue);
          };

          const onCancel = () => {
            ref.removeEventListener("cancel", onCancel);
            tearDown();
            resolve(null);
          };

          function tearDown() {
            ref.removeEventListener("close", onClose);
            ref.removeEventListener("cancel", onCancel);
            dialogRef.current = null;
          }

          // Listen for the 'close' event on the dialog
          ref.addEventListener("close", onClose);
          ref.addEventListener("cancel", onCancel);
          ref.showModal();
        });
      });
    },
    []
  );

  const closeDialog = useCallback((eraseProps: boolean = true) => {
    if (dialogRef.current) {
      dialogRef.current.close();
      if (eraseProps) {
        setDialogProps(null);
      }
    }
  }, []);

  return { openDialog, dialogProps, onDialogRef, closeDialog, setDialogProps };
}
