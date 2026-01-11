
'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStorage } from '@/hooks/useStorage';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const AlertsContainer = () => {
  const [{ error, successMessage }, setStore] = useStorage();
  const [alerts, setAlerts] = useState<any[]>([]);
  //  ref for save ID 
  const timersRef = useRef<{ [key: string]: NodeJS.Timeout[] }>({});

  const generateUniqueId = (): string => {
    return `id_${Math.random().toString(36).slice(2, 11)}`;
  };

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isVisible: false } : a))
    );

    const cleanupTimer = setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
      delete timersRef.current[id];
    }, 200);

    if (!timersRef.current[id]) timersRef.current[id] = [];
    timersRef.current[id].push(cleanupTimer);
  }, []);

  const addAlert = useCallback(
    (type: 'destructive' | 'success', message: string) => {
      const id = generateUniqueId();
      timersRef.current[id] = [];

      setAlerts((prev) => [...prev, { id, type, message, isVisible: false }]);

      // show timer
      const showTimer = setTimeout(() => {
        setAlerts((prev) =>
          prev.map((a) => (a.id === id ? { ...a, isVisible: true } : a))
        );
      }, 10);

      // deleted after 5 seconds
      const autoDismissTimer = setTimeout(() => {
        removeAlert(id);
      }, 5000);

      timersRef.current[id].push(showTimer, autoDismissTimer);
    },
    [removeAlert]
  );

  // deleted set time out
  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach((alertTimers) => {
        alertTimers.forEach(clearTimeout);
      });
    };
  }, []);

  useEffect(() => {
    if (error) {
      addAlert('destructive', error);
      setStore((prev) => ({ ...prev, error: '' }));
    }
    if (successMessage) {
      addAlert('success', successMessage);
      setStore((prev) => ({ ...prev, successMessage: '' }));
    }
  }, [error, successMessage, setStore, addAlert]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[1001] w-full max-w-[412px] px-4">
      <div className="flex flex-col gap-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`transition-all duration-300 ease-in-out ${
              alert.isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-2'
            }`}
          >
            {/* added bg-white  */}
            <Alert
              variant={alert.type}
              className="bg-white shadow-xl border border-gray-100 pr-10"
            >
              {alert.type === 'destructive' ? (
                <AlertCircle className="size-5 text-red-600" />
              ) : (
                <CheckCircle2 className="size-5 text-green-600" />
              )}
              <button
                onClick={() => removeAlert(alert.id)}
                className="absolute right-3 top-4 text-gray-400 hover:text-gray-600"
              >
                <X className="size-4" />
              </button>
              <AlertDescription className="text-gray-800 font-medium">
                {alert.message}
              </AlertDescription>
            </Alert>
          </div>
        ))}
      </div>
    </div>
  );
};