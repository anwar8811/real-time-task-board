"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function NavHeader() {
  const { user, isLoading, logout } = useAuth();

  return (
    <div className="navbar bg-base-100 border-b border-base-300 px-4">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost text-xl">
          Task Board
        </Link>
      </div>

      <div className="navbar-end gap-2">
        {isLoading ? (
          <span className="loading loading-spinner loading-sm" />
        ) : user ? (
          <>
            <span className="text-sm">Hi, {user.name}</span>
            <button className="btn btn-ghost" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="btn btn-ghost">
              Log in
            </Link>
            <Link href="/register" className="btn btn-primary">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
