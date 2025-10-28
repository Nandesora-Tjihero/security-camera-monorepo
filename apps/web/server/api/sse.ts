import { addClient, removeClient } from '../utils/sse';

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Content-Type', 'text/event-stream');
  setResponseHeader(event, 'Cache-Control', 'no-cache');
  setResponseHeader(event, 'Connection', 'keep-alive');

  const userId = getQuery(event).userId as string;
  if (!userId) {
    event.node.res.statusCode = 400;
    event.node.res.end('Missing userId query parameter');
    return;
  }

  const res = event.node.res;
  res.write('\n'); // Keep connection alive

  const id = addClient({ res, userId });

  event.node.req.on('close', () => {
    console.log(`Client disconnected: ${id}`);
    removeClient(id);
  });
});
