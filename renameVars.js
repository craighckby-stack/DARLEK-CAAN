/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: renameVars.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

import { readFileSync, writeFileSync } from 'node:fs';

const TARGET_FILE = 'src/App.tsx';

// Pre-compile regular expressions globally to avoid repeated instantiation overhead.
const REGEX_SHOW_DEBATE = /showDebateOverlay/g;
const REGEX_SET_SHOW_DEBATE = /setShowDebateOverlay/g;

// Execute replacement in a single pass/memory buffer optimization
const content = readFileSync(TARGET_FILE, 'utf8');
const updatedContent = content
    .replace(REGEX_SHOW_DEBATE, 'isDebating')
    .replace(REGEX_SET_SHOW_DEBATE, 'setIsDebating');

writeFileSync(TARGET_FILE, updatedContent, 'utf8');