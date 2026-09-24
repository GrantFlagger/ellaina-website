"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getSessionUser,
  signOut,
  updateProfile,
} from "@/app/actions/auth";
import type { AuthUser, WishlistProduct } from "@/lib/auth-types";

export type { AuthUser, WishlistProduct };

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** Store the user returned by a successful sign-in/verification action. */
  login: (user: AuthUser) => void;
  logout: () => Promise<void>;
  /** Saves name/phone/gender to the InsForge profile; resolves false on failure. */
  updateUser: (data: Partial<Pick<AuthUser, "name" | "phone" | "gender">>) => Promise<boolean>;
  toggleWishlist: (product: WishlistProduct) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// The session itself lives in InsForge auth cookies; only the wishlist is
// kept in the browser, per account.
const wishlistKey = (userId: string) => `ellaina_wishlist_${userId}`;

function readWishlist(userId: string): WishlistProduct[] {
  try {
    const raw = window.localStorage.getItem(wishlistKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback((nextUser: AuthUser) => {
    setUser({ ...nextUser, wishlist: readWishlist(nextUser.id) });
  }, []);

  useEffect(() => {
    let cancelled = false;
    getSessionUser()
      .then((sessionUser) => {
        if (cancelled) return;
        if (sessionUser) login(sessionUser);
      })
      .catch(() => {
        // Treat a failed session check as signed out.
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [login]);

  const logout = async () => {
    setUser(null);
    await signOut();
  };

  const updateUser: AuthContextValue["updateUser"] = async (data) => {
    const result = await updateProfile(data);
    if (!result.ok) return false;
    setUser((prev) => (prev ? { ...prev, ...result.user, wishlist: prev.wishlist } : prev));
    return true;
  };

  const toggleWishlist = (product: WishlistProduct) => {
    setUser((prev) => {
      if (!prev) return prev;
      const current = prev.wishlist ?? [];
      const exists = current.some((p) => p.id === product.id);
      const wishlist = exists
        ? current.filter((p) => p.id !== product.id)
        : [...current, product];
      try {
        window.localStorage.setItem(wishlistKey(prev.id), JSON.stringify(wishlist));
      } catch {
        // storage unavailable — state still updates for this session
      }
      return { ...prev, wishlist };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
        toggleWishlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
