"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type WishlistProduct = {
  id: string;
  slug: string;
  name: { el: string; en: string };
  image: string;
};

export type AuthUser = {
  name: string;
  email: string;
  phone?: string;
  wishlist?: WishlistProduct[];
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  updateUser: (data: Partial<AuthUser>) => void;
  toggleWishlist: (product: WishlistProduct) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "ellaina_auth_user";

/*
 * Front-end-only auth state for now: persists to localStorage so the
 * Navbar reflects a logged-in profile across refreshes/pages without a
 * real backend yet. Swap `login`/`logout`/`updateUser` for real API calls
 * (e.g. insforge.auth.signIn / signOut / updateProfile) once the backend
 * is wired up — the shape of this context can stay the same, so
 * consuming components (Navbar, AuthForm, Profile) won't need to change.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persist = (nextUser: AuthUser | null) => {
    setUser(nextUser);
    try {
      if (nextUser) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // storage unavailable — state still updates for this session
    }
  };

  const login = (nextUser: AuthUser) => {
    // Merge onto any existing stored profile so phone/wishlist survive
    // a login -> logout -> login cycle during development.
    setUser((prev) => {
      const merged: AuthUser =
        prev && prev.email === nextUser.email ? { ...prev, ...nextUser } : nextUser;
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch {
        // ignore
      }
      return merged;
    });
  };

  const logout = () => persist(null);

  const updateUser = (data: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...data };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const toggleWishlist = (product: WishlistProduct) => {
    setUser((prev) => {
      if (!prev) return prev;
      const current = prev.wishlist ?? [];
      const exists = current.some((p) => p.id === product.id);
      const wishlist = exists
        ? current.filter((p) => p.id !== product.id)
        : [...current, product];
      const next = { ...prev, wishlist };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
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