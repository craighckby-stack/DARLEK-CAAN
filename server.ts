import http, { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import next from 'next';

const PORT = parseInt(process.env.PORT ?? '3000', 10);
const HOSTNAME = '0.0.0.0';
const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production';

const nextApp = next({ dev: IS_DEVELOPMENT, hostname: HOSTNAME, port: PORT });
const requestHandler = nextApp.getRequestHandler();

async function handleIncomingRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const parsedUrl = parse(req.url ?? '/', true);
  await requestHandler(req, res, parsedUrl);
}

function handleRequestError(err: unknown, res: ServerResponse): void {
  console.error('Error handling request:', err);
  
  if (!res.headersSent) {
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}

async function startServer(): Promise<void> {
  try {
    await nextApp.prepare();

    const server = http.createServer(async (req, res) => {
      try {
        await handleIncomingRequest(req, res);
      } catch (err) {
        handleRequestError(err, res);
      }
    });

    server.listen(PORT, HOSTNAME, () => {
      console.log(`> Ready on http://${HOSTNAME}:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to prepare Next.js app:', err);
    process.exit(1);
  }
}

void startServer();