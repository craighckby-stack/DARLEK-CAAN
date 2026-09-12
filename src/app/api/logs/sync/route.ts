/**
 * DARLEK CANN ARCHITECTURAL API ROUTE
 * File: src/app/api/logs/sync/route.ts
 * Role: Server-side route that collects all logs, postmortems, mutations, and telemetry
 *       and pushes them directly to the GitHub repository under the 'logs/' folder.
 */

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { resolve, join } from 'path';
import { getLearningLogs } from '@/lib/learningLogs';
import { getRagLogs, getRagMutations } from '@/lib/ragBrain';
import { safeReqJson } from '@/lib/safe-json';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await safeReqJson(req);
    const token = body?.token || process.env.GITHUB_TOKEN || '';
    const owner = body?.owner || process.env.GITHUB_OWNER || 'craighckby-stack';
    const repo = body?.repo || process.env.GITHUB_REPO || 'DARLEK-CAAN-Cognitive-Engine';
    const branch = body?.branch || process.env.GITHUB_BRANCH || 'main';

    const learningLogs = await getLearningLogs();
    const ragLogs = await getRagLogs();
    const ragMutations = await getRagMutations();

    const nowIso = new Date().toISOString();

    const systemLogsJson = JSON.stringify(
      {
        metadata: {
          syncedAt: nowIso,
          totalSystemLogs: ragLogs.length,
          totalLearningLogs: learningLogs.length,
          totalMutations: ragMutations.length,
        },
        logs: ragLogs,
      },
      null,
      2
    );

    const learningLogsJson = JSON.stringify(
      {
        metadata: { syncedAt: nowIso, totalEntries: learningLogs.length },
        learningLogs,
      },
      null,
      2
    );

    const mutationsJson = JSON.stringify(
      {
        metadata: { syncedAt: nowIso, totalMutations: ragMutations.length },
        mutations: ragMutations,
      },
      null,
      2
    );

    const postmortemsMd =
      `# DALEK CAAN REPOSITORY POSTMORTEMS & LESSONS\n*Synchronized from Firebase on: ${nowIso}*\n\n` +
      learningLogs
        .map(
          (l) =>
            `### [${l.timestamp.slice(0, 10)}] ${l.title}\n**Symptom:** ${l.symptom || 'N/A'}\n**Constraint:** ${l.constraint || 'N/A'}\n`
        )
        .join('\n---\n');

    // Also write to local workspace disk under logs/
    try {
      const logsDir = resolve(process.cwd(), 'logs');
      await fs.mkdir(logsDir, { recursive: true });
      await fs.writeFile(join(logsDir, 'system_logs.json'), systemLogsJson, 'utf8');
      await fs.writeFile(join(logsDir, 'learning_logs.json'), learningLogsJson, 'utf8');
      await fs.writeFile(join(logsDir, 'mutations.json'), mutationsJson, 'utf8');
      await fs.writeFile(join(logsDir, 'POSTMORTEMS.md'), postmortemsMd, 'utf8');
    } catch (diskErr) {
      console.warn('[Logs Sync API] Error writing local logs directory:', diskErr);
    }

    // If token is provided, push to GitHub via bulk-commit endpoint internally
    if (token) {
      const files = [
        { path: 'logs/system_logs.json', content: systemLogsJson },
        { path: 'logs/learning_logs.json', content: learningLogsJson },
        { path: 'logs/mutations.json', content: mutationsJson },
        { path: 'logs/POSTMORTEMS.md', content: postmortemsMd },
      ];

      const commitRes = await fetch(
        new URL('/api/github/bulk-commit', req.url).toString(),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            owner,
            repo,
            branch,
            files,
            commitMessage: `[DARLEK CAAN] Sync Firebase & RAG logs to logs/ folder [${nowIso}]`,
          }),
        }
      );

      const commitData = await commitRes.json();
      return NextResponse.json({
        success: true,
        pushedToGitHub: commitData.success ?? false,
        commitSha: commitData.commitSha,
        totalLogs: ragLogs.length + learningLogs.length,
        syncedAt: nowIso,
      });
    }

    return NextResponse.json({
      success: true,
      pushedToGitHub: false,
      message: 'Logs saved locally to logs/ folder (GitHub token not provided)',
      totalLogs: ragLogs.length + learningLogs.length,
      syncedAt: nowIso,
    });
  } catch (error: any) {
    console.error('[Logs Sync API] Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
