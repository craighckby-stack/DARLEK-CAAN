import { Worker, isMainThread, parentPort } from 'node:worker_threads';
import process from 'node:process';

/**
 * Formats an unknown error caught in try/catch blocks into a readable message.
 */
function formatErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Orchestrates worker execution, monitoring message events and handling cleanup from the main thread.
 */
async function runMainThread(): Promise<void> {
  try {
    const worker = new Worker(__filename);

    worker.on('message', async (message: unknown): Promise<void> => {
      process.stdout.write(`from worker: ${String(message)}\n`);

      try {
        await worker.terminate();
        process.exit(0);
      } catch (terminateError: unknown) {
        process.stderr.write(`failed to terminate worker cleanly: ${formatErrorMessage(terminateError)}\n`);
        process.exit(1);
      }
    });

    worker.on('error', (error: Error): void => {
      process.stderr.write(`worker error: ${error.message}\n`);
      process.exit(1);
    });

    worker.on('exit', (exitCode: number): void => {
      if (exitCode !== 0) {
        process.stderr.write(`worker stopped with exit code ${exitCode}\n`);
        process.exit(exitCode);
      }
    });
  } catch (initError: unknown) {
    process.stderr.write(`failed to initialize worker: ${formatErrorMessage(initError)}\n`);
    process.exit(1);
  }
}

/**
 * Handles communication back to the main thread within the worker thread context.
 */
function runWorkerThread(): void {
  if (parentPort === null) {
    process.stderr.write('parentPort is missing in worker thread context\n');
    process.exit(1);
  }

  try {
    parentPort.postMessage('hello');
  } catch (postError: unknown) {
    process.stderr.write(`failed to post message from worker: ${formatErrorMessage(postError)}\n`);
    process.exit(1);
  }
}

// Entry point execution
if (isMainThread) {
  void runMainThread();
} else {
  runWorkerThread();
}