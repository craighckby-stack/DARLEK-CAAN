import { collection, addDoc, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from './firebase';

export interface LearningLog {
  readonly id?: string;
  readonly type: 'learning' | 'bug' | 'postmortem';
  readonly title: string;
  readonly symptom?: string;
  readonly evidence?: string;
  readonly constraint?: string;
  readonly timestamp: string;
}

const COLLECTION_NAME = 'dalek_learning_logs';

/**
 * Parses a markdown string (specifically structured like /docs/POSTMORTEMS.md)
 * into a structured array of LearningLog objects.
 */
export function parsePostmortemsMarkdown(md: string): LearningLog[] {
  const logs: LearningLog[] = [];
  if (!md) return logs;

  // Split by h3 header line
  const sections = md.split(/(?=### )/);
  for (const section of sections) {
    if (!section.trim().startsWith('### ')) continue;

    // Extract title
    const headerMatch = section.match(/###\s*(.*?)\n/);
    if (!headerMatch) continue;
    const titleLine = headerMatch[1].trim();

    // Extract symptom
    const symptomMatch = section.match(/\*\*Symptom:\*\*\s*(.*?)\n/);
    const symptom = symptomMatch ? symptomMatch[1].trim() : '';

    // Extract evidence inside code blocks
    const evidenceMatch = section.match(/\*\*EVIDENCE \(Machine-Copied Fact\):\*\*\s*\n```([\s\S]*?)```/);
    const evidence = evidenceMatch ? evidenceMatch[1].trim() : '';

    // Extract constraint / lessons
    const constraintMatch = section.match(/\*\*CONSTRAINT \(Model Generalization\):\*\*\s*([\s\S]*?)(?:\n\n|$)/);
    const constraint = constraintMatch ? constraintMatch[1].trim() : '';

    // Parse date from title e.g. [2026-09-08]
    const dateMatch = titleLine.match(/\[(.*?)\]/);
    let timestamp = new Date().toISOString();
    if (dateMatch) {
      try {
        const parsedDate = new Date(dateMatch[1]);
        if (!isNaN(parsedDate.getTime())) {
          timestamp = parsedDate.toISOString();
        }
      } catch {
        // Fallback to now
      }
    }

    logs.push({
      type: 'postmortem',
      title: titleLine,
      symptom,
      evidence,
      constraint,
      timestamp
    });
  }

  return logs;
}

/**
 * Reads the local /docs/POSTMORTEMS.md file (on server-side only).
 */
function readLocalPostmortems(): string {
  if (typeof window !== 'undefined') return '';
  try {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(process.cwd(), 'docs', 'POSTMORTEMS.md');
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf8');
    }
  } catch (error) {
    console.warn('[Darlek Caan] Failed to read local POSTMORTEMS.md file:', error);
  }
  return '';
}

/**
 * Synchronizes local POSTMORTEMS.md logs into Firestore if they don't already exist.
 */
export async function syncPostmortemsToFirebase(): Promise<void> {
  if (typeof window !== 'undefined') return;

  try {
    const localMd = readLocalPostmortems();
    if (!localMd) return;

    const parsedLogs = parsePostmortemsMarkdown(localMd);
    if (parsedLogs.length === 0) return;

    // Fetch existing logs from firestore to avoid duplicates
    const colRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(colRef);
    const existingTitles = new Set<string>();

    snapshot.forEach((docSnap: QueryDocumentSnapshot<DocumentData>) => {
      const data = docSnap.data();
      if (typeof data.title === 'string') {
        existingTitles.add(data.title);
      }
    });

    for (const log of parsedLogs) {
      if (!existingTitles.has(log.title)) {
        await addDoc(colRef, {
          type: log.type,
          title: log.title,
          symptom: log.symptom ?? '',
          evidence: log.evidence ?? '',
          constraint: log.constraint ?? '',
          timestamp: log.timestamp
        });
        console.log(`[Darlek Caan] Synced postmortem log: "${log.title}" to Firestore.`);
      }
    }
  } catch (error) {
    console.error('[Darlek Caan] Error syncing postmortems to Firebase:', error);
  }
}

/**
 * Saves a new learning, bug or postmortem log into Firestore.
 */
export async function saveLearningLog(
  log: Omit<LearningLog, 'id' | 'timestamp'>
): Promise<string> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const timestamp = new Date().toISOString();
    const docRef = await addDoc(colRef, {
      type: log.type,
      title: log.title,
      symptom: log.symptom ?? '',
      evidence: log.evidence ?? '',
      constraint: log.constraint ?? '',
      timestamp
    });
    return docRef.id;
  } catch (error) {
    console.error('[Darlek Caan] Failed to save learning log:', error);
    throw error;
  }
}

/**
 * Retrieves all learning/bug/postmortem logs from Firestore, or falls back to
 * local parsed postmortems if Firestore is empty or offline.
 */
export async function getLearningLogs(): Promise<LearningLog[]> {
  const logs: LearningLog[] = [];
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(colRef);

    if (!snapshot.empty) {
      snapshot.forEach((docSnap: QueryDocumentSnapshot<DocumentData>) => {
        const data = docSnap.data();
        logs.push({
          id: docSnap.id,
          type: (data.type as 'learning' | 'bug' | 'postmortem') || 'postmortem',
          title: typeof data.title === 'string' ? data.title : 'Untitled Lesson',
          symptom: typeof data.symptom === 'string' ? data.symptom : '',
          evidence: typeof data.evidence === 'string' ? data.evidence : '',
          constraint: typeof data.constraint === 'string' ? data.constraint : '',
          timestamp: typeof data.timestamp === 'string' ? data.timestamp : new Date().toISOString()
        });
      });
      return logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    }
  } catch (error) {
    console.warn('[Darlek Caan] Firestore logs fetch failed, falling back to local file:', error);
  }

  // Fallback to local markdown file if empty/offline
  const localMd = readLocalPostmortems();
  if (localMd) {
    return parsePostmortemsMarkdown(localMd).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }

  return logs;
}

/**
 * Formats learning logs into a clear negative constraint prompt block to feed to the LLM.
 */
export async function getFormattedConstraints(): Promise<string> {
  try {
    // Sync first if in Node environment to ensure database has latest entries
    if (typeof window === 'undefined') {
      await syncPostmortemsToFirebase();
    }

    const logs = await getLearningLogs();
    if (logs.length === 0) return '';

    const formatted = logs.map(log => {
      const evidenceSegment = log.evidence ? `\nEvidence of Issue:\n\`\`\`\n${log.evidence}\n\`\`\`` : '';
      return `### CONSTRAINT: ${log.title}
Severity Level / Symptom: ${log.symptom || 'Compiler Failure'}${evidenceSegment}
MANDATORY NEGATIVE CONSTRAINT (Lesson): ${log.constraint || 'Never repeat this mistake.'}
`;
    }).join('\n');

    return `
======================================================================
[CRITICAL SYSTEM INTEGRITY GUARDIAN] NEGATIVE CONSTRAINTS & FAILURE LOGS
======================================================================
You are strictly forbidden from writing code that introduces any of these verified syntax/semantic compiler errors or architectural anti-patterns:

${formatted}
======================================================================
`;
  } catch (error) {
    console.error('[Darlek Caan] Failed to format learning constraints:', error);
    return '';
  }
}
