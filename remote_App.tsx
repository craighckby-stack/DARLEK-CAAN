/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: remote_App.tsx
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

import React, { useState, useEffect, useRef, useCallback, useMemo, ReactElement } from 'react';
import { Chess } from 'chess.js';
import { useSystemBootstrap } from './hooks/useSystemBootstrap';
import { useAgentOrchestra } from './hooks/useAgentOrchestra';
import { useQuantumState } from './hooks/useQuantumState';
import { 
  initAudioEngine, 
  speakDalekText, 
  speakJesusText, 
  stopSpeaking, 
  setChronosLoadValue 
} from './components/SoundEngine';
import { GameSettings, GameMode, GameDifficulty, BoardTheme, DalekDialogue } from './types';

export default function App(): ReactElement {
  const isSystemReady: boolean = useSystemBootstrap();
  const { dispatch: dispatchOrchestra } = useAgentOrchestra();
  
  const [quantumMetrics, setQuantumMetrics] = useQuantumState({
    timelineStability: 100,
    entropyCoefficient: 0.12,
    chronosLoad: 0,
    omegaTuningStatus: 'PENDING'
  });

  const chessEngine = useMemo<Chess>(() => new Chess(), []);
  
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    mode: GameMode.PVD,
    difficulty: GameDifficulty.MEDIUM,
    theme: BoardTheme.CRUCIBLE,
    playerColor: 'w',
    muteSounds: false,
    synthesizerVolume: 0.6,
  });

  const [temporalDialogue, setTemporalDialogue] = useState<DalekDialogue>({
    text: "SYSTEM INITIALIZED. THE CHESS GRID IS READY.",
    emotion: "prophetic",
    prophecyLevel: 50,
    timestamp: 1711929600000,
  });

  const isAudioInitializedRef = useRef<boolean>(false);

  const handleAudioInitialization = useCallback((): void => {
    if (!isAudioInitializedRef.current) {
      try {
        initAudioEngine();
        isAudioInitializedRef.current = true;
      } catch (error) {
        console.error("CRITICAL: Failed to initialize audio engine", error);
      } finally {
        window.removeEventListener('click', handleAudioInitialization);
        window.removeEventListener('touchstart', handleAudioInitialization);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('click', handleAudioInitialization, { passive: true });
    window.addEventListener('touchstart', handleAudioInitialization, { passive: true });
    
    return () => {
      window.removeEventListener('click', handleAudioInitialization);
      window.removeEventListener('touchstart', handleAudioInitialization);
    };
  }, [handleAudioInitialization]);

  useEffect(() => {
    if (typeof quantumMetrics?.chronosLoad === 'number') {
      setChronosLoadValue(quantumMetrics.chronosLoad);
    }
  }, [quantumMetrics?.chronosLoad]);

  const systemStatusText = useMemo<string>(() => 
    isSystemReady ? 'STABILIZED' : 'INITIALIZING',
    [isSystemReady]
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-mono p-4">
      <header className="border-b border-zinc-800 pb-4 mb-8">
        <h1 className="text-2xl font-bold tracking-tighter">DARLEK CANN v3.0</h1>
        <div className="text-xs text-zinc-500">
          OMEGA_BOOT_SEQUENCE: {systemStatusText}
        </div>
      </header>
      
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <div className="aspect-square bg-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-center">
            <span className="text-zinc-700">[CHESS_GRID_RENDERER]</span>
          </div>
        </section>
        
        <aside className="space-y-6">
          <div className="p-4 bg-zinc-900 rounded border border-zinc-800">
            <h2 className="text-sm uppercase tracking-widest mb-2">Temporal Dialogue</h2>
            <p className="text-sm leading-relaxed">{temporalDialogue.text}</p>
          </div>
        </aside>
      </main>
    </div>
  );
}