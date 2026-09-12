import { collection, addDoc, getDocs, doc, writeBatch, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

const LOCAL_STORAGE_KEY = 'nexus_rag_brain_local_chunks';

function getLocalChunks(): BrainChunk[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BrainChunk[]) : [];
  } catch {
    return [];
  }
}

function saveLocalChunks(chunks: BrainChunk[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(chunks));
  } catch {}
}

// Pre-computed lookup tables for O(1) binary conversion
const BINARY_LOOKUP = new Array<string>(256);
for (let i = 0; i < 256; i++) {
  BINARY_LOOKUP[i] = i.toString(2).padStart(8, '0');
}

/**
 * Converts a text string into a continuous stream of 8-bit binary digits.
 * Optimized via pre-computed lookup tables and zero-allocation charCode caching.
 */
export function textToBinary(text: string): string {
  if (!text) return '';
  const length = text.length;
  const chunks = new Array<string>(length);
  for (let i = 0; i < length; i++) {
    chunks[i] = BINARY_LOOKUP[text.charCodeAt(i) & 0xFF] ?? '';
  }
  return chunks.join('');
}

/**
 * Decodes a continuous stream of 8-bit binary digits back into a text string.
 * Optimized with batch chunk extraction, String.fromCharCode application, and chunk slicing bypasses.
 */
export function binaryToText(binary: string): string {
  if (!binary) return '';
  const length = binary.length;
  const validLength = length - (length % 8);
  if (validLength <= 0) return '';

  const numChars = validLength >> 3;
  const charCodes = new Uint16Array(numChars);
  
  for (let i = 0, j = 0; i < validLength; i += 8, j++) {
    charCodes[j] = parseInt(binary.substring(i, i + 8), 2);
  }

  // Apply in chunks to avoid call stack size limits with large arrays
  if (numChars <= 65535) {
    return String.fromCharCode.apply(null, charCodes as unknown as number[]);
  }

  let result = '';
  for (let i = 0; i < numChars; i += 65535) {
    const chunk = charCodes.subarray(i, i + 65535);
    result += String.fromCharCode.apply(null, chunk as unknown as number[]);
  }
  return result;
}

export interface BrainChunk {
  readonly id: string;
  readonly sourceName: string;
  readonly fileName: string;
  readonly codeText: string;
  readonly binaryCode: string;
  readonly generation: number;
  readonly timestamp: string;
}

const COLLECTION_NAME = 'dalek_rag_brain';

/**
 * Stores a code chunk in Firestore within the RAG brain collection after binary encoding with robust error management.
 */
export async function saveBrainChunk(
  sourceName: string,
  fileName: string,
  codeText: string,
  generation: number
): Promise<string> {
  if (!sourceName || !fileName || codeText === undefined || generation < 0) {
    throw new Error('[Darlek Caan] Invalid arguments supplied to saveBrainChunk.');
  }

  const binaryCode = textToBinary(codeText);
  const timestamp = new Date().toISOString();
  const localId = `chunk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  if (!isFirebaseConfigured()) {
    const existing = getLocalChunks();
    const newChunk: BrainChunk = {
      id: localId,
      sourceName,
      fileName,
      binaryCode,
      codeText,
      generation,
      timestamp
    };
    saveLocalChunks([...existing, newChunk]);
    return localId;
  }

  try {
    const colRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(colRef, {
      sourceName,
      fileName,
      binaryCode,
      generation,
      timestamp
    });
    return docRef.id;
  } catch (error) {
    console.warn('[Darlek Caan] Firestore saveBrainChunk offline, saving to local store:', error);
    const existing = getLocalChunks();
    const newChunk: BrainChunk = {
      id: localId,
      sourceName,
      fileName,
      binaryCode,
      codeText,
      generation,
      timestamp
    };
    saveLocalChunks([...existing, newChunk]);
    return localId;
  }
}

/**
 * Retrieves all stored brain chunks from Firestore or local fallback storage,
 * decoding binary payloads back to text and sorting them chronologically.
 */
export async function getBrainChunks(): Promise<BrainChunk[]> {
  if (!isFirebaseConfigured()) {
    return getLocalChunks().sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }

  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(colRef);
    
    if (snapshot.empty) {
      return getLocalChunks().sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    }

    const size = snapshot.size;
    const chunks = new Array<BrainChunk>(size);
    let index = 0;

    snapshot.forEach((documentSnap: QueryDocumentSnapshot<DocumentData>) => {
      const data = documentSnap.data();
      const rawBinary = data['binaryCode'];
      const rawSource = data['sourceName'];
      const rawFile = data['fileName'];
      const rawGen = data['generation'];
      const rawTime = data['timestamp'];

      const binaryCode = typeof rawBinary === 'string' ? rawBinary : '';
      const codeText = binaryToText(binaryCode);
      
      chunks[index++] = {
        id: documentSnap.id,
        sourceName: typeof rawSource === 'string' ? rawSource : 'Unknown Siphon',
        fileName: typeof rawFile === 'string' ? rawFile : 'App.tsx',
        binaryCode,
        codeText,
        generation: typeof rawGen === 'number' ? rawGen : 0,
        timestamp: typeof rawTime === 'string' ? rawTime : new Date().toISOString()
      };
    });
    
    return chunks.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  } catch (error) {
    console.warn('[Darlek Caan] Firestore getBrainChunks offline, loading local store:', error);
    return getLocalChunks().sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }
}

/**
 * Clears all brain chunks from the Firestore collection and local storage.
 */
export async function clearBrainChunks(): Promise<void> {
  saveLocalChunks([]);

  if (!isFirebaseConfigured()) {
    return;
  }

  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(colRef);
    
    if (snapshot.empty) {
      return;
    }

    const batch = writeBatch(db);
    snapshot.forEach((documentSnap: QueryDocumentSnapshot<DocumentData>) => {
      batch.delete(documentSnap.ref);
    });
    
    await batch.commit();
  } catch (error) {
    console.warn('[Darlek Caan] Firestore clearBrainChunks offline, cleared local store:', error);
  }
}

/**
 * Fast cosine similarity algorithm extracted from the Cognitive Resolution Engine.
 */
export function fastCosineSimilarity(a: readonly number[], b: readonly number[]): number {
  const len: number = a.length < b.length ? a.length : b.length;
  if (len === 0) return 1.0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  let i = 0;
  const unrolledLimit: number = len - (len & 3);
  for (; i < unrolledLimit; i += 4) {
    const a0 = a[i] ?? 0, b0 = b[i] ?? 0;
    const a1 = a[i + 1] ?? 0, b1 = b[i + 1] ?? 0;
    const a2 = a[i + 2] ?? 0, b2 = b[i + 2] ?? 0;
    const a3 = a[i + 3] ?? 0, b3 = b[i + 3] ?? 0;
    dot += a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3;
    normA += a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
    normB += b0 * b0 + b1 * b1 + b2 * b2 + b3 * b3;
  }
  for (; i < len; i++) {
    const ai = a[i] ?? 0;
    const bi = b[i] ?? 0;
    dot += ai * bi;
    normA += ai * ai;
    normB += bi * bi;
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Ranks stored RAG brain chunks using intent vector and term-frequency matching.
 */
export function rankBrainChunksByRelevance(chunks: readonly BrainChunk[], query: string, limit = 5): BrainChunk[] {
  if (!query.trim() || chunks.length === 0) return chunks.slice(0, limit);
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

  const scored = chunks.map(chunk => {
    const textLower = chunk.codeText.toLowerCase();
    let score = 0;
    for (const term of terms) {
      if (textLower.includes(term)) score += 1;
    }
    return { chunk, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .map(s => s.chunk)
    .slice(0, limit);
}