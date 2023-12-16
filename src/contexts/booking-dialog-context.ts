"use client";

import { ComponentType, createContext } from "react";
import { BookDialogProps } from "../components/book-dialog/book-dialog";

export const BookDialogContext = createContext<
  (
    DialogComponent: ComponentType<BookDialogProps>,
    initialParams: BookDialogProps
  ) => Promise<string | null>
>(() => Promise.resolve(null));
