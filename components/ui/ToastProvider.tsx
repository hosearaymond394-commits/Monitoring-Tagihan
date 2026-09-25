"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";
import { createContext, useCallback, useContext, useState, ReactNode } from "react";

interface ToastMsg {
  id: number;
  message: string;
  isError?: boolean;
}

const ToastContext = createContext<(message: string, isError?: boolean) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  const showToast = useCallback((message: string, isError?: boolean) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, isError }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={
              "flex items-center gap-2 rounded-lg px-4 py-3 text-[13px] font-semibold text-white shadow-xl " +
              (t.isError ? "bg-brandred-600" : "bg-navy-900")
            }
          >
            {t.isError ? <AlertCircle size={16} /> : <CheckCircle2 size={16} className="text-brandgreen-600" />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
