import { Worker, isMainThread, parentPort } from 'node:worker_threads';
import process from 'node:process';

if (isMainThread) {
  let worker: Worker | null = null;
  
  try {
    worker = new Worker(__filename);
    
    worker.on('message', (msg: unknown) => {
      process.stdout.write('from worker: ' + String(msg) + '\n');
      const activeWorker = worker;
      if (activeWorker !== null) {
        void activeWorker.terminate().then(() => {
          process.exit(0);
        }).catch((terminateErr: unknown) => {
          const termErrMsg = terminateErr instanceof Error ? terminateErr.message : String(terminateErr);
          process.stderr.write('failed to terminate worker cleanly: ' + termErrMsg + '\n');
          process.exit(1);
        });
      } else {
        process.exit(0);
      }
    });

    worker.on('error', (err: Error) => {
      process.stderr.write('worker error: ' + err.message + '\n');
      process.exit(1);
    });

    worker.on('exit', (code: number) => {
      if (code !== 0) {
        process.stderr.write('worker stopped with exit code ' + code + '\n');
        process.exit(code);
      }
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    process.stderr.write('failed to initialize worker: ' + errorMsg + '\n');
    process.exit(1);
  }
} else {
  const port = parentPort;
  if (port === null) {
    process.stderr.write('parentPort is missing in worker thread context\n');
    process.exit(1);
  }

  try {
    port.postMessage('hello');
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    process.stderr.write('failed to post message from worker: ' + errorMsg + '\n');
    process.exit(1);
  }
}