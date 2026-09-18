'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Server,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type ServerState = 'checking' | 'online' | 'sleeping' | 'error';

export function ServerStatusBanner() {
  // Disable completely on localhost or development
  const isLocal =
    process.env.NODE_ENV === 'development' ||
    API_BASE_URL.includes('localhost') ||
    API_BASE_URL.includes('127.0.0.1');

  if (isLocal && process.env.NEXT_PUBLIC_SHOW_SERVER_BANNER !== 'true') {
    return null;
  }

  const [status, setStatus] = useState<ServerState>('checking');
  const [latency, setLatency] = useState<number | null>(null);
  const [secondsWaiting, setSecondsWaiting] = useState<number>(0);
  const [isWakingUp, setIsWakingUp] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [autoCollapseTimeout, setAutoCollapseTimeout] =
    useState<NodeJS.Timeout | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const checkHealth = useCallback(async (manual = false): Promise<boolean> => {
    if (manual) {
      setIsWakingUp(true);
      setSecondsWaiting(0);
    }

    const startTime = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout per probe

      const res = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: { 'Cache-Control': 'no-cache' },
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const roundTrip = Math.round(performance.now() - startTime);
        setLatency(roundTrip);
        setStatus('online');
        setIsWakingUp(false);

        // Schedule auto-collapse after 4 seconds of being online
        const timeout = setTimeout(() => {
          setIsCollapsed(true);
        }, 4000);
        setAutoCollapseTimeout(timeout);
        return true;
      } else {
        setStatus('sleeping');
        setIsCollapsed(false);
        return false;
      }
    } catch {
      setStatus('sleeping');
      setIsCollapsed(false);
      return false;
    }
  }, []);

  // Poll until online when waking up
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isWakingUp || status === 'sleeping') {
      timerRef.current = setInterval(() => {
        setSecondsWaiting((prev) => prev + 1);
      }, 1000);

      interval = setInterval(async () => {
        const isOnline = await checkHealth(false);
        if (isOnline) {
          setIsWakingUp(false);
        }
      }, 3500);
    } else {
      setSecondsWaiting(0);
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isWakingUp, status, checkHealth]);

  // Initial check on mount
  useEffect(() => {
    checkHealth(false);
    return () => {
      if (autoCollapseTimeout) clearTimeout(autoCollapseTimeout);
    };
  }, [checkHealth, autoCollapseTimeout]);

  // Collapsed Pill View (Compact Header Status)
  if (isCollapsed && status === 'online') {
    return (
      <div className="w-full bg-[#080c14] border-b border-emerald-900/40 px-4 py-1 flex items-center justify-between text-[11px] text-slate-400 animate-in fade-in duration-300">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-medium text-emerald-400">
              API Online (Render Live)
            </span>
            {latency !== null && (
              <span className="text-slate-500 font-mono text-[10px]">
                • {latency}ms
              </span>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(false)}
            className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-200 transition-colors py-0.5 px-2 rounded hover:bg-slate-800/60"
          >
            Server Details
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full border-b transition-all duration-300 z-50 text-xs ${
        status === 'online'
          ? 'bg-emerald-950/90 border-emerald-800/80 text-emerald-200'
          : status === 'checking'
          ? 'bg-indigo-950/90 border-indigo-800/80 text-indigo-200'
          : 'bg-gradient-to-r from-amber-950/95 via-indigo-950/95 to-amber-950/95 border-amber-600/50 text-amber-100 shadow-lg shadow-amber-950/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`p-1.5 rounded-lg shrink-0 ${
              status === 'online'
                ? 'bg-emerald-800/40 text-emerald-400'
                : status === 'checking'
                ? 'bg-indigo-800/40 text-indigo-400 animate-spin'
                : 'bg-amber-600/30 text-amber-300 animate-pulse'
            }`}
          >
            {status === 'online' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : status === 'checking' ? (
              <RefreshCw className="w-4 h-4" />
            ) : (
              <Server className="w-4 h-4" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 font-semibold text-xs tracking-tight">
              {status === 'online' && (
                <span className="text-emerald-300">
                  NestJS REST API Online & Operational
                </span>
              )}
              {status === 'checking' && (
                <span>Probing REST API connection...</span>
              )}
              {status === 'sleeping' && (
                <span className="flex items-center gap-1.5 text-amber-200 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  Render Backend in Sleep Mode (Free Tier)
                </span>
              )}
            </div>

            <p className="text-[11px] opacity-80 mt-0.5 leading-relaxed">
              {status === 'online' &&
                `Instance active and ready for incoming requests (${latency ?? 80}ms latency).`}
              {status === 'checking' &&
                'Please wait while we verify backend connection...'}
              {status === 'sleeping' &&
                'Render free tier instances spin down after inactivity. Cold start takes ~30-50s on the first request.'}
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
          {status === 'sleeping' && (
            <button
              onClick={() => checkHealth(true)}
              disabled={isWakingUp}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 shadow-md ${
                isWakingUp
                  ? 'bg-amber-700/60 text-amber-200 cursor-wait border border-amber-600/40'
                  : 'bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white border border-amber-400/50 shadow-amber-600/30 active:scale-95'
              }`}
            >
              {isWakingUp ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Waking up Instance ({secondsWaiting}s)...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Wake Up Server Now</span>
                </>
              )}
            </button>
          )}

          {status === 'online' && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 rounded-lg text-emerald-400/80 hover:text-emerald-200 hover:bg-emerald-900/40 transition-colors"
              title="Collapse status banner"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Visual progress bar while waking up */}
      {isWakingUp && (
        <div className="w-full bg-amber-950/60 h-1 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-400 via-indigo-400 to-emerald-400 h-full w-full animate-pulse transition-all duration-300" />
        </div>
      )}
    </div>
  );
}
