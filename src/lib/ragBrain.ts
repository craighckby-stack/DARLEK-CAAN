import { collection, addDoc, getDocs, doc, writeBatch, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from './firebase';

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
    chunks[i] = BINARY_LOOKUP[text.charCodeAt(i) & 0xFF];
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

  try {
    const binaryCode = textToBinary(codeText);
    const colRef = collection(db, COLLECTION_NAME);
    
    const docRef = await addDoc(colRef, {
      sourceName,
      fileName,
      binaryCode,
      generation,
      timestamp: new Date().toISOString()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('[Darlek Caan] Critical failure during saveBrainChunk persistence:', error);
    throw error;
  }
}

/**
 * Retrieves all stored brain chunks from Firestore, decoding binary payloads back to text
 * and sorting them chronologically by timestamp with strict type assertions.
 */
export async function getBrainChunks(): Promise<BrainChunk[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(colRef);
    
    const size = snapshot.size;
    const chunks = new Array<BrainChunk>(size);
    let index = 0;

    snapshot.forEach((documentSnap: QueryDocumentSnapshot<DocumentData>) => {
      const data = documentSnap.data();
      const binaryCode = typeof data.binaryCode === 'string' ? data.binaryCode : '';
      const codeText = binaryToText(binaryCode);
      
      chunks[index++] = {
        id: documentSnap.id,
        sourceName: typeof data.sourceName === 'string' ? data.sourceName : 'Unknown Siphon',
        fileName: typeof data.fileName === 'string' ? data.fileName : 'App.tsx',
        binaryCode,
        codeText,
        generation: typeof data.generation === 'number' ? data.generation : 0,
        timestamp: typeof data.timestamp === 'string' ? data.timestamp : new Date().toISOString()
      };
    });
    
    return chunks.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  } catch (error) {
    console.error('[Darlek Caan] Critical failure during getBrainChunks retrieval:', error);
    return [];
  }
}

/**
 * Clears all brain chunks from the Firestore collection utilizing batched write operations for maximum efficiency.
 */
export async function clearBrainChunks(): Promise<void> {
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
    console.error('[Darlek Caan] Critical failure during clearBrainChunks batch execution:', error);
    throw error;
  }
}