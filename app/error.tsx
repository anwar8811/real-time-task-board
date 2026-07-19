"use client";

import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="alert alert-error max-w-md flex-col items-start gap-3">
        <span className="font-semibold">Something went wrong!</span>
        <button
          className="btn btn-sm btn-outline"
          onClick={() => unstable_retry()}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
