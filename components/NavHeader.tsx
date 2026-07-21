"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function NavHeader() {
  const { user, isLoading, logout } = useAuth();

  return (
    <div className="navbar sticky top-0 z-50 border-b border-base-300 bg-base-100/90 px-4 backdrop-blur sm:px-8">
      <div className="navbar-start">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </span>
          Task Board
        </Link>
      </div>

      <div className="navbar-end gap-2">
        {isLoading ? (
          <span className="loading loading-spinner loading-sm" />
        ) : user ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost flex items-center gap-2 px-2"
            >
              <div className="avatar avatar-placeholder">
                <div className="w-8 rounded-full bg-primary text-primary-content">
                  <span className="text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <span className="hidden text-sm font-medium sm:inline">
                {user.name}
              </span>
            </div>
            <ul
              tabIndex={-1}
              className="menu dropdown-content z-1 mt-3 w-52 rounded-box bg-base-100 p-2 shadow-lg"
            >
              <li className="menu-title px-3 py-1 text-xs">{user.email}</li>
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          <>
            <Link href="/login" className="btn btn-ghost">
              Log in
            </Link>
            <Link href="/register" className="btn btn-primary">
              Get Started
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
