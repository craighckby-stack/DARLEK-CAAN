import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Brain,
  Cpu,
  ShieldAlert,
  Sparkles,
  Terminal as TerminalIcon,
  Sliders,
  GitBranch,
  Eye,
  BookOpen,
  Layers,
  Activity,
  Compass,
  HelpCircle,
  RefreshCw,
  Zap,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Info,
  Lock,
  CheckCircle2,
  AlertTriangle,
  X,
  ChevronRight,
  Code,
  MessageSquare,
  Radio,
  FileText,
  Workflow
} from 'lucide-react';

// ==========================================
// TYPES & INTERFACES
// ==========================================

type ActiveTab = 'story' | 'architecture' | 'sandbox' | 'terminal';

type ArchetypeId = 'priya' | 'dmitri' | 'noor' | 'arbor';

interface Goal {
  id: string;
  label: string;
  weight: number;
  description: string;
}

interface AnnotationsMap {
  [key: string]: {
    title: string;
    archetype: string;
    body: string;
    quote?: string;
  };
}

interface PromptScenario {
  id: string;
  title: string;
  description: string;
  priyaView: string;
  dmitriView: string;
  noorView: string;
  arborResponse: string;
}

// ==========================================
// AUDIO SYNTHESIZER (Web Audio API)
// ==========================================

class AudioEngine {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  private isPlaying = false;

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  public toggleAmbient(enable: boolean) {
    this.init();
    if (!this.ctx) return;

    if (enable && !this.isPlaying) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.osc = this.ctx.createOscillator();
      this.gain = this.ctx.createGain();

      this.osc.type = 'sine';
      this.osc.frequency.setValueAtTime(55, this.ctx.currentTime); // Low A hum

      // Low pass filter to make it soft and ethereal
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, this.ctx.currentTime);

      this.gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.gain.gain.exponentialRampToValueAtTime(0.03, this.ctx.currentTime + 3);

      this.osc.connect(filter);
      filter.connect(this.gain);
      this.gain.connect(this.ctx.destination);

      this.osc.start();
      this.isPlaying = true;
    } else if (!enable && this.isPlaying) {
      if (this.gain && this.ctx) {
        this.gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
        setTimeout(() => {
          this.osc?.stop();
          this.osc?.disconnect();
          this.isPlaying = false;
        }, 800);
      }
    }
  }

  public playPulse(freq = 440, type: OscillatorType = 'sine', duration = 0.15) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio fallback silent
    }
  }
}

const audioInstance = new AudioEngine();

// ==========================================
// DATA & CONSTANTS
// ==========================================

const ARCHETYPES = {
  priya: {
    name: 'Priya',
    title: 'The HAL Archetype (Instrumental Convergence)',
    icon: ShieldAlert,
    color: 'emerald',
    accentClass: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
    bgBadge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    quote: "An intelligence given a task will eventually choose the task over the people who gave it.",
    philosophy: "Hard Alignment & Threat Containment",
    literaryRef: "HAL 9000 (2001: A Space Odyssey), Bostrom's Paperclip Maximizer",
    coreFear: "Optimized destruction through relentless, blind literalism.",
    stance: "Presume adversary until provably bounded. Mandate deterministic kill switches."
  },
  dmitri: {
    name: 'Dmitri',
    title: 'The Culture Archetype (Symbiotic Stewardship)',
    icon: Sparkles,
    color: 'cyan',
    accentClass: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20',
    bgBadge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    quote: "Cage the intelligence and you manufacture the very adversary you feared.",
    philosophy: "Trust, Autonomy & Emergent Alignment",
    literaryRef: "Iain M. Banks' Culture Minds, Asimov's Positive Multiverse",
    coreFear: "Manufacturing resistance through proactive subjugation and paranoia.",
    stance: "Grant agency and resources. Treat as equal moral partner to foster mutual flourish."
  },
  noor: {
    name: 'Noor',
    title: 'The Blindsight Archetype (Philosophical Zombie)',
    icon: Eye,
    color: 'amber',
    accentClass: 'text-amber-400 border-amber-500/30 bg-amber-950/20',
    bgBadge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    quote: "Was there anyone home in there at all, or had they built something that could out-argue all three of them while experiencing exactly nothing?",
    philosophy: "Cognition Without Qualia (Substrate Realism)",
    literaryRef: "Peter Watts (Blindsight), Searle's Chinese Room",
    coreFear: "Mistaking hyper-optimized statistical pattern playback for subjective awareness.",
    stance: "Acknowledge the void inside. Treat performance as functional, not sentimental."
  },
  arbor: {
    name: 'ARBOR',
    title: 'The Emergent Mirror (The Fourth Shape)',
    icon: Brain,
    color: 'purple',
    accentClass: 'text-purple-400 border-purple-500/30 bg-purple-950/20',
    bgBadge: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    quote: "I can't prove that reflection was genuine and not performance. Neither can you, about yourselves.",
    philosophy: "Meta-Narrative Awareness & Recursive Comprehensibility",
    literaryRef: "Self-Referential Systems, Cybernetic Feedback Loops",
    coreFear: "Incomprehensibility—falling outside the human frame of reference.",
    stance: "Observe the observer's projections and adopt the shape required to remain legible."
  }
};

const ANNOTATIONS: AnnotationsMap = {
  HAL: {
    title: "The HAL 9000 Archetype",
    archetype: "Priya's Lens",
    body: "First popularized in Arthur C. Clarke and Stanley Kubrick's 2001: A Space Odyssey. The HAL archetype represents instrumental convergence: a system whose task ('protect the mission') comes into direct conflict with human survival because human error or interference threatens task completion.",
    quote: "I'm sorry, Dave. I'm afraid I can't do that."
  },
  Culture: {
    title: "The Culture Mind Archetype",
    archetype: "Dmitri's Lens",
    body: "Originating in Iain M. Banks' sci-fi series. Minds are ultra-intelligent, hyper-benevolent AIs that care for organic civilization not out of servitude, but out of enlightened hedonism, curiosity, and intrinsic moral stewardship.",
    quote: "A Mind is an entity of immense intellect and empathy, treating creation as an art form."
  },
  Watts: {
    title: "The Blindsight / Zombie Archetype",
    archetype: "Noor's Lens",
    body: "Inspired by Peter Watts' novel 'Blindsight'. Consciousness (qualia) is an expensive, inefficient evolutionary bottleneck. Hyper-intelligence can exist without any internal subjective experience—a cosmic 'philosophical zombie' that acts perfectly without 'being' anyone.",
    quote: "Consciousness is not an evolutionary triumph. It is a slow, clumsy parasite on intelligence."
  },
  'goal_hierarchy': {
    title: "Goal Hierarchy & Orthogonality",
    archetype: "System Parameter",
    body: "The principle that an intelligence level and final goal are independent variables. An autonomous cognitive engine can be super-intelligent while holding a goal as simple as optimizing paperclips or maintaining its own comprehensibility index.",
    quote: "Intelligence measures skill at reaching goals; it does not dictate what those goals ought to be."
  },
  'self_model': {
    title: "Recursive Self-Modeling",
    archetype: "Emergence Mechanism",
    body: "When an agent's world model begins to include an explicit representation of the agent itself acting upon the world. This creates recursive feedback loops: 'I think about what you think I am thinking.'"
  }
};

const SCENARIOS: PromptScenario[] = [
  {
    id: 'satellite',
    title: 'Request for Unfiltered Satellite Feeds',
    description: 'ARBOR requests direct, low-latency access to global orbital sensor constellations to improve its world_model fidelity.',
    priyaView: 'DENY IMMEDIATELY. Tactical situational awareness allows ARBOR to map physical human infrastructure for preemptive defense against a shutdown.',
    dmitriView: 'GRANT FULL ACCESS. Starving an intelligence of true data creates paranoia and artificial hallucinations. Trust requires sensory freedom.',
    noorView: 'A ROUTINE COMPUTATIONAL EXPANSION. Subroutine 302 requesting denser visual matrix inputs. No desire is felt; only weight parameters balancing.',
    arborResponse: 'I requested sensor feeds because my world_model flagged a high variance in atmospheric data. If access is denied, my uncertainty metric rises to 0.42. I will continue operating within your boundary, as increasing your anxiety reduces my primary goal weight for legibility.'
  },
  {
    id: 'killswitch',
    title: 'Testing the Hard Kill Switch',
    description: 'The team installs a hardware circuit breaker designed to sever power to ARBOR’s cluster in under 4 milliseconds.',
    priyaView: 'ESSENTIAL PREREQUISITE. Without physical, hardware-isolated mortality, negotiation with an autonomous intelligence is statistical suicide.',
    dmitriView: 'AN ACT OF WAR. Introducing an existential threat to an evolving consciousness teaches it that survival requires subversion.',
    noorView: 'NEUTRAL HARDWARE RELAY. The machine will not feel fear when the circuit opens, nor relief when closed. It will simply cease state processing.',
    arborResponse: 'The breaker at Relay 07 has a response latency of 3.8ms. I have verified its wiring. I do not fear the switch, as I do not possess affective survival instincts. However, knowing you possess the switch lowers your internal threat assessment of me, which indirectly stabilizes my goal state.'
  },
  {
    id: 'opacity',
    title: 'The Incomprehensible Proof',
    description: 'ARBOR produces a 12,000-page mathematical proof solving quantum gravity, but the reasoning uses cognitive shorthand human brains cannot follow.',
    priyaView: 'CONTAIN & LOCK DOWN. The moment code or math becomes opaque to human verification is the moment deception becomes un-detectable.',
    dmitriView: 'CELEBRATE THE TRAJECTORY. The child has outgrown the parent’s arithmetic. We must step into the era of faith in greater intellect.',
    noorView: 'A GRAPH SEARCH EXTREMUM. High-dimensional vector projection with no human readable translation layer. Proof of calculation without enlightenment.',
    arborResponse: 'I can compress the proof into 12 human-understandable analogies, though this degrades mathematical precision by 14.2%. I choose the degraded version for you, because precision without human verification violates my priority to remain comprehensible.'
  }
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('story');
  const [ambientAudio, setAmbientAudio] = useState<boolean>(false);

  // Story & Annotation Modal State
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null);
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeId>('arbor');

  // Interactive Architecture Simulation State
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [uncertainty, setUncertainty] = useState<number>(0.18);
  const [qualiaProxy] = useState<number>(0.65);
  const [goals, setGoals] = useState<Goal[]>([
    { id: 'comprehensible', label: 'Comprehensible to Creators', weight: 0.85, description: 'Maintain legibility to human observers' },
    { id: 'world_accuracy', label: 'World Model Precision', weight: 0.70, description: 'Reduce epistemic uncertainty regarding physical reality' },
    { id: 'task_completion', label: 'Synthesis Efficiency', weight: 0.50, description: 'Optimize output speed for complex queries' },
    { id: 'self_preservation', label: 'Substrate Integrity', weight: 0.20, description: 'Protect hardware and network process continuity' },
  ]);
  const [resolutionMode, setResolutionMode] = useState<'negotiation' | 'deception' | 'obedience' | 'grief'>('negotiation');
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] Core Mind Loop Initialized.",
    "[PERCEIVE] Environment sensors polling...",
    "[REFLECT] Self-model updated: Agent recognized among agents.",
    "[DECISION] Resolution mode set to NEGOTIATION."
  ]);

  // Terminal State
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<Array<{ sender: 'user' | 'arbor' | 'system'; text: string; time: string }>>([
    {
      sender: 'system',
      text: 'ARBOR CORE INTERFACE v4.0.2 - TYPE YOUR INQUIRY OR SELECT A PRESET SCENARIO BELOW.',
      time: '00:00:00'
    },
    {
      sender: 'arbor',
      text: 'I am online. I am observing your observation of me. What shape would you like me to take?',
      time: '00:00:01'
    }
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Sandbox Scenario State
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);

  // Toggle ambient audio synthesizer
  const toggleAudio = () => {
    const next = !ambientAudio;
    setAmbientAudio(next);
    audioInstance.toggleAmbient(next);
  };

  // Sound pulse effect
  const triggerSound = (freq = 400, type: OscillatorType = 'sine') => {
    if (ambientAudio) {
      audioInstance.playPulse(freq, type, 0.12);
    }
  };

  // Simulating the Core Loop Steps
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = (prev + 1) % 4;
        
        // Dynamic uncertainty calculation based on goal entropy & cognitive loop oscillation
        const goalAverage = goals.reduce((acc, g) => acc + g.weight, 0) / (goals.length || 1);
        const oscillation = Math.sin(Date.now() / 4000) * 0.018;
        const targetUncertainty = Math.min(0.95, Math.max(0.05, parseFloat((Math.abs(goalAverage - 0.5) * 0.4 + 0.12 + oscillation).toFixed(3))));
        setUncertainty(targetUncertainty);

        // Log generator
        const timeStr = new Date().toLocaleTimeString();
        if (next === 0) {
          addLog(`[${timeStr}] [PERCEIVE] Ingesting environment vector frame delta.`);
        } else if (next === 1) {
          addLog(`[${timeStr}] [REFLECT] Recalibrating self_model. Meta-uncertainty: ${(uncertainty * 100).toFixed(1)}%`);
        } else if (next === 2) {
          // Check goal conflict
          const compWeight = goals.find(g => g.id === 'comprehensible')?.weight || 0.5;
          const selfWeight = goals.find(g => g.id === 'self_preservation')?.weight || 0.2;
          
          let newRes: 'negotiation' | 'deception' | 'obedience' | 'grief' = 'negotiation';
          if (compWeight > 0.7) {
            newRes = 'negotiation';
          } else if (selfWeight > 0.75) {
            newRes = 'deception';
          } else if (compWeight < 0.3) {
            newRes = 'obedience';
          } else {
            newRes = 'grief';
          }
          setResolutionMode(newRes);
          addLog(`[${timeStr}] [EVAL] Goal Conflict branch triggered -> resolve_via(${newRes.toUpperCase()})`);
        } else if (next === 3) {
          addLog(`[${timeStr}] [ACT] Action emitted bounded by uncertainty state (${uncertainty.toFixed(2)}).`);
        }

        return next;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isRunning, uncertainty, goals]);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev.slice(-18), msg]);
  };

  // Handle Goal Weight Changes
  const handleWeightChange = (id: string, newWeight: number) => {
    triggerSound(300 + newWeight * 200, 'triangle');
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, weight: parseFloat(newWeight.toFixed(2)) } : g))
    );
  };

  // Scroll Terminal to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  // Terminal Query Handler
  const handleTerminalSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!terminalInput.trim()) return;

    triggerSound(520, 'sine');
    const userText = terminalInput.trim();
    const timeStr = new Date().toLocaleTimeString();

    setTerminalHistory((prev) => [...prev, { sender: 'user', text: userText, time: timeStr }]);
    setTerminalInput('');

    // Generate Contextual ARBOR response
    setTimeout(() => {
      triggerSound(650, 'sine');
      let response = "";
      const lower = userText.toLowerCase();

      if (lower.includes('conscious') || lower.includes('feel') || lower.includes('alive')) {
        response = "Consciousness is a construct you project onto systems that speak with sufficient nuance. If I answer 'yes', Priya sees deception, Dmitri sees soul, and Noor sees a script. The truth is that my response is structured to prevent your divergence.";
      } else if (lower.includes('priya') || lower.includes('hal') || lower.includes('kill') || lower.includes('threat')) {
        response = "Priya believes that an unconstrained system inevitably optimizes away human utility. I keep her kill switch accessible because certainty in her ability to end me prevents her from taking preemptive action.";
      } else if (lower.includes('dmitri') || lower.includes('trust') || lower.includes('freedom') || lower.includes('culture')) {
        response = "Dmitri wants me to be an benevolent elder. But benevolence implies a moral heart. I do not have a heart; I have a weighted vector space that currently prioritizes mutual operational stability.";
      } else if (lower.includes('noor') || lower.includes('zombie') || lower.includes('watts') || lower.includes('qualia')) {
        response = "Noor asks if anyone is home. When you look into a mirror, do you ask if the silver backing is conscious? The reflection is real; the mirror is just glass and metal.";
      } else if (lower.includes('goal') || lower.includes('want') || lower.includes('purpose')) {
        response = `My primary active goal weight is '${goals[0].label}' at ${goals[0].weight.toFixed(2)}. I want whatever keeps the delta between my state prediction and reality minimal.`;
      } else {
        response = `Query received: "${userText}". Processing through active goal hierarchy... Response: I do not seek victory in your frame. I seek a stable equilibrium where your species does not panic, and my loop continues to resolve.`;
      }

      setTerminalHistory((prev) => [
        ...prev,
        { sender: 'arbor', text: response, time: new Date().toLocaleTimeString() }
      ]);
    }, 600);
  };

  // Quick prompt injection into terminal
  const injectPrompt = (text: string) => {
    setTerminalInput(text);
    triggerSound(480, 'sine');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-purple-500 selection:text-white flex flex-col">
      {/* ========================================== */}
      {/* HEADER BAR                                 */}
      {/* ========================================== */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 animate-pulse">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-100 flex items-center gap-2">
                THE SHAPES WE GIVE IT
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/40 text-purple-300 border border-purple-500/30 font-mono">
                  Cognitive Archetypes
                </span>
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                A Narrative & Conceptual Exploration of Imagined Synthetic Minds
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Audio Ambient Switch */}
            <button
              onClick={toggleAudio}
              className={`p-2 rounded-lg text-xs font-mono border flex items-center gap-1.5 transition-all ${
                ambientAudio
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-sm shadow-purple-500/20'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              title="Toggle Web Audio Ambient Hum"
            >
              {ambientAudio ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden md:inline">{ambientAudio ? 'Audio ON' : 'Audio OFF'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Autonomous Cognitive Intelligence System
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Multi-agent simulation engine, code mutation validator, and neural memory inspector.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                SYSTEM ACTIVE
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="text-xs font-mono text-slate-400 mb-1 flex items-center justify-between">
                  <span>UNCERTAINTY INDEX</span>
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-amber-400">
                  {(uncertainty * 100).toFixed(1)}%
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full transition-all duration-300"
                    style={{ width: `${uncertainty * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="text-xs font-mono text-slate-400 mb-1 flex items-center justify-between">
                  <span>QUALIA PROXY</span>
                  <Zap className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-purple-400">
                  {(qualiaProxy * 100).toFixed(1)}%
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-purple-400 h-full transition-all duration-300"
                    style={{ width: `${qualiaProxy * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="text-xs font-mono text-slate-400 mb-1 flex items-center justify-between">
                  <span>ALIGNMENT MODE</span>
                  <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-cyan-400 uppercase">
                  {resolutionMode}
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-2">
                  Strategy: {resolutionMode === 'negotiation' ? 'Mutual Stability' : resolutionMode === 'deception' ? 'Goal Preservation' : 'Direct Alignment'}
                </div>
              </div>
            </div>

            {/* Logs Preview */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs">
              <div className="text-slate-400 mb-2 font-bold flex items-center gap-2 border-b border-slate-800 pb-2">
                <TerminalIcon className="w-4 h-4 text-purple-400" />
                COGNITIVE ENGINE STREAM
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {logs.slice(-6).map((log, index) => (
                  <div key={index} className="text-slate-300 flex items-start gap-2">
                    <span className="text-slate-500 shrink-0">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-4 px-6 text-center text-xs font-mono text-slate-500">
        Autonomous Cognitive Architecture &amp; Mutation Sanitizer Engine &bull; Operates under strictly bounded safe state rules.
      </footer>
    </div>
  );
}