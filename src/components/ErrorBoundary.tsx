import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ParsedFirestoreError {
  operationType?: string;
  authInfo?: unknown;
  path?: string;
  error?: string;
}

const CHUNK_RELOAD_COOLDOWN_MS = 10000;
const LAST_CHUNK_RELOAD_KEY = 'last_chunk_reload';

/**
 * Encapsulates runtime exceptions, automatically handles chunk loading retries,
 * and renders a styled fallback interface for unrecoverable errors.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo);
    this.handleChunkLoadError(error);
  }

  private handleChunkLoadError(error: Error): void {
    const isChunkError = 
      error?.message?.includes('Loading chunk') || 
      error?.name === 'ChunkLoadError';

    if (!isChunkError) return;

    const lastReloadTimestamp = sessionStorage.getItem(LAST_CHUNK_RELOAD_KEY);
    const now = Date.now();
    const hasCooldownPassed = !lastReloadTimestamp || now - parseInt(lastReloadTimestamp, 10) > CHUNK_RELOAD_COOLDOWN_MS;

    if (hasCooldownPassed) {
      sessionStorage.setItem(LAST_CHUNK_RELOAD_KEY, now.toString());
      window.location.reload();
    }
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleNavigateHome = (): void => {
    window.location.href = '/';
  };

  private parseErrorDetails(error: Error | null): { errorMessage: string; isFirestoreError: boolean } {
    let errorMessage = 'An unexpected error occurred.';
    let isFirestoreError = false;

    if (!error?.message) {
      return { errorMessage, isFirestoreError };
    }

    try {
      const parsed: ParsedFirestoreError = JSON.parse(error.message);
      
      if (parsed.operationType && parsed.authInfo) {
        isFirestoreError = true;
        const operation = parsed.operationType.toUpperCase();
        const path = parsed.path || 'unknown';
        errorMessage = `Firestore ${operation} error at path: ${path}. ${parsed.error || ''}`;
      } else {
        errorMessage = error.message;
      }
    } catch {
      errorMessage = error.message;
    }

    return { errorMessage, isFirestoreError };
  }

  public render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const { errorMessage, isFirestoreError } = this.parseErrorDetails(this.state.error);

    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 font-mono">
        <div className="max-w-md w-full border border-red-900/30 bg-[#0A0000] p-8 rounded-lg shadow-2xl relative overflow-hidden">
          {/* Glitch Effect Background */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-950/50 rounded border border-red-900/50 animate-pulse">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h1 className="text-xl font-bold text-red-500 tracking-tighter uppercase italic">Neural Collapse</h1>
            </div>

            <div className="space-y-4 mb-8">
              <div className="p-4 bg-black border border-red-900/20 rounded text-[10px] text-red-400/80 leading-relaxed overflow-auto max-h-48 font-mono">
                <div className="font-bold mb-1 text-red-500 uppercase tracking-widest text-[8px]">Synaptic Error Signature:</div>
                {errorMessage}
              </div>
              
              {isFirestoreError && (
                <p className="text-[9px] text-red-600/60 italic uppercase tracking-tight">
                  CRITICAL: Security rules or authentication state preventing neural synchronization.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 p-3 bg-red-950/20 border border-red-900/50 text-red-500 hover:bg-red-900/30 transition-all rounded text-[10px] font-bold uppercase tracking-widest cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                Reboot System
              </button>
              <button
                onClick={this.handleNavigateHome}
                className="flex items-center justify-center gap-2 p-3 bg-[#111] border border-[#222] text-gray-500 hover:text-white transition-all rounded text-[10px] font-bold uppercase tracking-widest cursor-pointer"
              >
                <Home className="w-3 h-3" />
                Return Home
              </button>
            </div>
          </div>

          {/* Decorative Scanline */}
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500/10 animate-scanline pointer-events-none" />
        </div>
      </div>
    );
  }
}