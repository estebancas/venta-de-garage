import { toast as sonnerToast } from "sonner";

/**
 * Toast utility functions with consistent styling and behavior
 */

export const toast = {
  /**
   * Show a success toast notification
   */
  success: (message: string, options?: { duration?: number }) => {
    return sonnerToast.success(message, {
      duration: options?.duration ?? 4000,
    });
  },

  /**
   * Show an error toast notification with longer duration
   */
  error: (message: string, options?: { duration?: number }) => {
    return sonnerToast.error(message, {
      duration: options?.duration ?? 6000,
    });
  },

  /**
   * Show an info toast notification
   */
  info: (message: string, options?: { duration?: number }) => {
    return sonnerToast.info(message, {
      duration: options?.duration ?? 4000,
    });
  },

  /**
   * Show a warning toast notification
   */
  warning: (message: string, options?: { duration?: number }) => {
    return sonnerToast.warning(message, {
      duration: options?.duration ?? 5000,
    });
  },

  /**
   * Show a loading toast that can be updated later
   */
  loading: (message: string) => {
    return sonnerToast.loading(message);
  },

  /**
   * Show a promise toast that automatically updates based on promise state
   */
  promise: <T,>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    }
  ) => {
    return sonnerToast.promise(promise, options);
  },

  /**
   * Dismiss a specific toast by ID
   */
  dismiss: (toastId?: string | number) => {
    return sonnerToast.dismiss(toastId);
  },
};
