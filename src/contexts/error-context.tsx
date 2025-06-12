import React, { createContext, useContext, useCallback } from "react";
import { toastService } from "@/services/toast-service";
import { CustomError } from "@/lib/errors/custom-error";

interface ErrorContextType {
  handleError: (error: Error | CustomError) => void;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const handleError = useCallback((error: Error | CustomError) => {
    if (error instanceof CustomError) {
      toastService.error(error.message);
    } else {
      toastService.error(error.message || "An unexpected error occurred");
    }
  }, []);

  const showError = useCallback((message: string) => {
    toastService.error(message);
  }, []);

  const showSuccess = useCallback((message: string) => {
    toastService.success(message);
  }, []);

  const showWarning = useCallback((message: string) => {
    toastService.warning(message);
  }, []);

  const showInfo = useCallback((message: string) => {
    toastService.info(message);
  }, []);

  return (
    <ErrorContext.Provider
      value={{
        handleError,
        showError,
        showSuccess,
        showWarning,
        showInfo,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};
