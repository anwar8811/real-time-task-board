import Link from "next/link";

export default function NavHeader() {
  return (
    <div className="navbar bg-base-100 border-b border-base-300 px-4">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost text-xl">
          Task Board
        </Link>
      </div>

      <div className="navbar-end gap-2">
        <Link href="/login" className="btn btn-ghost">
          Log in
        </Link>
        <Link href="/register" className="btn btn-primary">
          Register
        </Link>
      </div>
    </div>
  );
}
