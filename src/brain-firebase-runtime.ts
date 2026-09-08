/**
 * BRAIN-FIREBASE-RUNTIME DNA CONTAINER
 * This file acts as the local shell for the Brain's Soul.
 * It is synced with the Firebase Realtime Database.
 * 
 * @version 2.2.0
 * @author Darlek Caan
 */

export interface BrainDnaContainer {
    readonly version: string;
    readonly compressedChunks: string;
    readonly index: readonly string[];
}

const EMPTY_INDEX: readonly string[] = Object.freeze([]) as readonly string[];

export const BRAIN_DNA: Readonly<BrainDnaContainer> = Object.freeze({
    version: "2.2.0",
    compressedChunks: "",
    index: EMPTY_INDEX,
});