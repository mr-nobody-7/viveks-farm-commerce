"use client";

import type { ReactNode } from "react";

export interface CartStoreProviderProps {
children: ReactNode;
}

// This provider is now just a wrapper for consistency
// The actual store is managed by Zustand with persistence
export const CartStoreProvider = ({ children }: CartStoreProviderProps) => {
return <>{children}</>;
};
