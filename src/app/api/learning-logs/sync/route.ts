/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: src/app/api/learning-logs/sync/route.ts
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

import { NextResponse } from 'next/server';
import { syncPostmortemsToFirebase, getLearningLogs } from '@/lib/learningLogs';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await syncPostmortemsToFirebase();
    const logs = await getLearningLogs();
    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    console.error('[Darlek Caan API] Error in sync postmortems API:', error);
    return NextResponse.json({ success: false, error: error.message || 'Unknown error' }, { status: 500 });
  }
}
