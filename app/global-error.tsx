"use client";

import "./globals.css";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-base-200 px-4">
        <div className="alert alert-error max-w-md flex-col items-start gap-3">
          <span className="font-semibold">A critical error occurred.</span>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => unstable_retry()}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
