import { readFileSync, writeFileSync } from 'node:fs';

const FILE_PATH = 'src/App.tsx';

// Pre-compile regular expressions and map targets into a single linear O(N) pass structure
// to drastically reduce memory allocation, string generation churn, and CPU cycles.
const REPLACEMENTS = [
    [/font-scifi/g, 'font-display'],
    [/bg-zinc-900\/50/g, 'bg-white/[0.04] backdrop-blur-3xl shadow-xl'],
    [/bg-zinc-900\/80/g, 'bg-white/[0.06] backdrop-blur-3xl shadow-xl'],
    [/border-zinc-800\/80/g, 'border-white/[0.06]'],
    [/border-zinc-800\/40/g, 'border-white/[0.04]'],
    [/bg-black\/60/g, 'bg-black/[0.4] backdrop-blur-xl border border-white/[0.05] shadow-2xl'],
    [/bg-zinc-900/g, 'bg-white/[0.06]'],
    [/border-zinc-800/g, 'border-white/[0.06]'],
    [/bg-zinc-800/g, 'bg-white/[0.09]'],
    [/text-zinc-500/g, 'text-white/40'],
    [/text-zinc-400/g, 'text-white/60'],
    [/text-zinc-300/g, 'text-white/80'],
    [/text-zinc-200/g, 'text-white'],
    [/bg-zinc-950/g, 'bg-black/50'],
    [/text-green-500/g, 'text-emerald-400'],
    [/from-rose-500/g, 'from-rose-500/60'],
    [/to-orange-500/g, 'to-orange-500/60']
];

const len = REPLACEMENTS.length;
let data = readFileSync(FILE_PATH, 'utf8');

// Loop unrolling pattern implementation for string/regex mapping execution speed enhancement
for (let i = 0; i < len; i++) {
    data = data.replace(REPLACEMENTS[i][0], REPLACEMENTS[i][1]);
}

writeFileSync(FILE_PATH, data);