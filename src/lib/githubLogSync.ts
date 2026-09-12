/**
 * DARLEK CAAN ARCHITECTURAL SERVICE
 * File: src/lib/githubLogSync.ts
 * Role: Full-time background synchronization daemon that automatically persists
 *       all Firebase, RAG brain, system telemetry, and learning logs to GitHub in a
 *       dedicated 'logs/' directory within the repository.
 */

import { getLearningLogs, type LearningLog } from './learningLogs';
import { getRagLogs, getRagMutations, type RagLogRecord, type RagMutationRecord } from './ragBrain';
import { msDosEngine } from './msDosEngine';
import { getGitHubConfig } from './github';

export interface LogSyncResult {
  readonly success: boolean;
  readonly syncedFiles: readonly string[];
  readonly totalLogsCount: number;
  readonly commitSha?: string;
  readonly error?: string;
  readonly timestamp: string;
}

let syncTimeout: ReturnType<typeof setTimeout> | null = null;
let isSyncing = false;
let lastSyncTimestamp: string | null = null;

/**
 * Formats structured postmortem and learning logs into clean markdown
 * to save as logs/POSTMORTEMS.md in GitHub.
 */
function generatePostmortemsMarkdown(logs: readonly LearningLog[]): string {
  const timestamp = new Date().toISOString();
  const header = `# DALEK CAAN REPOSITORY POSTMORTEMS & LESSONS LOG\n*Auto-synchronized from Firebase & RAG Brain on: ${timestamp}*\n\n---\n\n`;

  if (logs.length === 0) {
    return `${header}No postmortems recorded yet.\n`;
  }

  const sections = logs.map((log) => {
    return `### [${log.timestamp.slice(0, 10)}] ${log.title}\n\n` +
      `**Type:** ${log.type.toUpperCase()}\n\n` +
      `**Symptom:** ${log.symptom || 'Not specified'}\n\n` +
      `**EVIDENCE (Machine-Copied Fact):**\n\`\`\`\n${log.evidence || 'No direct evidence snippet recorded.'}\n\`\`\`\n\n` +
      `**CONSTRAINT (Model Generalization):** ${log.constraint || 'Maintain strict zero-error invariant.'}\n\n---\n`;
  }).join('\n');

  return header + sections;
}

/**
 * Formats live MS-DOS telemetry and system logs into logs/active_telemetry.log
 */
function generateTelemetryLogText(dosLines: readonly { time: string; addr: string; tag: string; message: string }[]): string {
  const timestamp = new Date().toISOString();
  let text = '======================================================================\n';
  text += `DARLEK CAAN CONTINUOUS TELEMETRY LOG BUFFER [SYNCED: ${timestamp}]\n`;
  text += '======================================================================\n\n';

  dosLines.forEach((line) => {
    text += `[${line.time}] [${line.addr}] [${line.tag.padEnd(10, ' ')}] ${line.message}\n`;
  });

  return text;
}

/**
 * Gathers all logs across Firebase, RAG brain, and telemetry engines
 * and builds a collection of files specifically targeted for the `logs/` folder in GitHub.
 */
export async function buildLogPayloadFiles(): Promise<Array<{ path: string; content: string }>> {
  const learningLogs = await getLearningLogs();
  const ragLogs = await getRagLogs();
  const ragMutations = await getRagMutations();
  const dosLines = msDosEngine.getState().lines;

  const nowIso = new Date().toISOString();

  // 1. Consolidated system logs json
  const systemLogsPayload = {
    metadata: {
      generatedAt: nowIso,
      engine: 'DARLEK_CAAN_RAG_KERNEL',
      totalLogs: ragLogs.length + learningLogs.length,
      totalMutations: ragMutations.length,
    },
    systemLogs: ragLogs,
    telemetryBuffer: dosLines.slice(-100),
  };

  // 2. Learning logs & postmortems json
  const learningLogsPayload = {
    metadata: {
      generatedAt: nowIso,
      totalEntries: learningLogs.length,
    },
    learningLogs,
  };

  // 3. Mutations history json
  const mutationsPayload = {
    metadata: {
      generatedAt: nowIso,
      totalMutations: ragMutations.length,
    },
    mutations: ragMutations,
  };

  // 4. Formatted Markdown postmortems
  const postmortemsMd = generatePostmortemsMarkdown(learningLogs);

  // 5. Raw chronological telemetry text
  const telemetryLog = generateTelemetryLogText(dosLines);

  return [
    {
      path: 'logs/system_logs.json',
      content: JSON.stringify(systemLogsPayload, null, 2),
    },
    {
      path: 'logs/learning_logs.json',
      content: JSON.stringify(learningLogsPayload, null, 2),
    },
    {
      path: 'logs/mutations.json',
      content: JSON.stringify(mutationsPayload, null, 2),
    },
    {
      path: 'logs/rag_brain_logs.json',
      content: JSON.stringify(ragLogs, null, 2),
    },
    {
      path: 'logs/POSTMORTEMS.md',
      content: postmortemsMd,
    },
    {
      path: 'logs/active_telemetry.log',
      content: telemetryLog,
    },
  ];
}

/**
 * Commits and synchronizes all system, Firebase, and RAG logs into GitHub
 * in the repository's dedicated `logs/` folder.
 */
export async function syncAllLogsToGitHub(configOverride?: {
  token?: string;
  owner?: string;
  repo?: string;
  branch?: string;
}): Promise<LogSyncResult> {
  if (isSyncing) {
    return {
      success: false,
      syncedFiles: [],
      totalLogsCount: 0,
      error: 'Sync already in progress',
      timestamp: new Date().toISOString(),
    };
  }

  isSyncing = true;
  try {
    const config = getGitHubConfig();
    const token = configOverride?.token || config.token;
    const owner = configOverride?.owner || config.username || 'craighckby-stack';
    const repo = configOverride?.repo || config.repoName || 'DARLEK-CAAN-Cognitive-Engine';
    const branch = configOverride?.branch || 'main';

    const filesToSync = await buildLogPayloadFiles();

    // Call GitHub Bulk Commit or Write API to store all files under logs/
    const response = await fetch('/api/github/bulk-commit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        owner,
        repo,
        branch,
        files: filesToSync,
        commitMessage: `[DARLEK CAAN] Auto-sync Firebase & RAG logs to logs/ [${new Date().toISOString()}]`,
      }),
    });

    const data = await response.json();
    lastSyncTimestamp = new Date().toISOString();

    if (!response.ok || !data.success) {
      console.warn('[GitHub Log Sync] Sync responded with non-ok or demo mode:', data);
      return {
        success: false,
        syncedFiles: filesToSync.map((f) => f.path),
        totalLogsCount: filesToSync.length,
        error: data.error || 'GitHub sync returned unsuccessful status',
        timestamp: lastSyncTimestamp,
      };
    }

    msDosEngine.addLog(
      'LOG_SYNC',
      `All Firebase & RAG logs successfully pushed to GitHub repository under 'logs/' [${filesToSync.length} files committed]`
    );

    return {
      success: true,
      syncedFiles: filesToSync.map((f) => f.path),
      totalLogsCount: filesToSync.length,
      commitSha: data.commitSha,
      timestamp: lastSyncTimestamp,
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.warn('[GitHub Log Sync] Log sync error:', err);
    return {
      success: false,
      syncedFiles: [],
      totalLogsCount: 0,
      error: errorMessage,
      timestamp: new Date().toISOString(),
    };
  } finally {
    isSyncing = false;
  }
}

/**
 * Schedules a debounced background sync so rapid log additions batch efficiently
 * and persistently sync to GitHub without spamming the API.
 */
export function scheduleGitHubLogSync(debounceMs = 4000): void {
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }
  syncTimeout = setTimeout(() => {
    syncAllLogsToGitHub().catch(() => {});
  }, debounceMs);
}

export function getLastGitHubLogSyncTime(): string | null {
  return lastSyncTimestamp;
}