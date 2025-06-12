"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { toastService } from "@/services/toast-service";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    toastService.error("Something went wrong. Please try again.");
  }, [error]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-screen p-4"
    >
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-error mb-4">Oops!</h1>
        <h2 className="text-2xl font-semibold mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-8">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => reset()} className="btn btn-primary">
            Try Again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="btn btn-outline"
          >
            Back to Home
          </button>
        </div>
      </div>
    </motion.div>
  );
}
