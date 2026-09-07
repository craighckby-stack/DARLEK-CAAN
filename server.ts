import http, { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import next from 'next';

const PORT: number = parseInt(process.env.PORT ?? '3000', 10);
const HOSTNAME: string = '0.0.0.0';
const IS_DEVELOPMENT: boolean = process.env.NODE_ENV !== 'production';

const nextApp = next({ dev: IS_DEVELOPMENT, hostname: HOSTNAME, port: PORT });
const requestHandler = nextApp.getRequestHandler();

const INTERNAL_ERROR_BUFFER: Buffer = Buffer.from('Internal Server Error', 'utf-8');

function handleRequestError(err: unknown, res: ServerResponse): void {
  console.error('Error handling request:', err);
  
  if (!res.headersSent) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Length', INTERNAL_ERROR_BUFFER.length);
    res.end(INTERNAL_ERROR_BUFFER);
  }
}

const serverListener = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  try {
    const parsedUrl = parse(req.url ?? '/', true);
    await requestHandler(req, res, parsedUrl);
  } catch (err: unknown) {
    handleRequestError(err, res);
  }
};

async function startServer(): Promise<void> {
  try {
    await nextApp.prepare();

    const server = http.createServer(serverListener);

    server.listen(PORT, HOSTNAME, () => {
      console.log(`> Ready on http://${HOSTNAME}:${PORT}`);
    });
  } catch (err: unknown) {
    console.error('Failed to prepare Next.js app:', err);
    process.exit(1);
  }
}

void startServer();