export default function Footer() {
  return (
    <footer className="border-t border-base-300 bg-base-100">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-base-content/60 sm:flex-row">
        <span>
          © {new Date().getFullYear()} Task Board. All rights reserved.
        </span>
        <span>Built with Next.js, Socket.io</span>
      </div>
    </footer>
  );
}
