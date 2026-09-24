"use client";

import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    // Honour the OS "reduce motion" setting for every framer-motion animation.
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              {children}
              <CartDrawer />
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </MotionConfig>
  );
}
