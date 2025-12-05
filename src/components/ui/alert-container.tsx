'use client';

import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStorage } from '@/hooks/useStorage';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const AlertsContainer = () => {
  const [{ error, successMessage }, setStore] = useStorage();
  const [alerts, setAlerts] = useState<
    {
      id: string;
      type: 'destructive' | 'success';
      message: string;
      isVisible: boolean;
    }[]
  >([]);

  const generateUniqueId = (): string => {
    return `id_${Math.random().toString(36).substr(2, 9)}`;
  };

  const addAlert = React.useCallback(
    (type: 'destructive' | 'success', message: string) => {
      const id = generateUniqueId();

      // Insert hidden, then reveal next tick for transition
      setAlerts((prev) => [...prev, { id, type, message, isVisible: false }]);

      setTimeout(() => {
        setAlerts((prev) =>
          prev.map((a) => (a.id === id ? { ...a, isVisible: true } : a))
        );
      }, 10);

      // Auto dismiss with fade-out
      setTimeout(() => {
        setAlerts((prev) =>
          prev.map((a) => (a.id === id ? { ...a, isVisible: false } : a))
        );
        setTimeout(() => {
          setAlerts((prev) => prev.filter((a) => a.id !== id));
        }, 200);
      }, 5000);
    },
    []
  );

  const removeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isVisible: false } : a))
    );
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 200);
  };

  useEffect(() => {
    if (error && error !== '') {
      addAlert('destructive', error);
      setStore((prevState) => ({
        ...prevState,
        error: '',
      }));
    }

    if (successMessage && successMessage !== '') {
      addAlert('success', successMessage);
      setStore((prevState) => ({
        ...prevState,
        successMessage: '',
      }));
    }
  }, [error, successMessage, setStore, addAlert]);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[1001] w-full max-w-[412px] px-4 sm:px-6">
      <div className="flex flex-col gap-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`relative transition-all duration-200 ease-out ${alert.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}
          >
            <Alert variant={alert.type} className="shadow-lg pr-10 w-full">
              {alert.type === 'destructive' ? (
                <AlertCircle className="min-w-6 min-h-6" />
              ) : (
                <CheckCircle2 className="min-w-6 min-h-6" />
              )}
              <button
                type="button"
                aria-label="Close alert"
                onClick={() => removeAlert(alert.id)}
                className="absolute right-3 top-3 text-night-sky hover:text-night-sky/70"
              >
                <X className="h-4 w-4" />
              </button>
              <AlertDescription className="break-words">
                {alert.message}
              </AlertDescription>
            </Alert>
          </div>
        ))}
      </div>
    </div>
  );
};
