import { sendEvent } from '../utils/sse';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, tokens } = body;
  sendEvent({
    event: 'REGISTER_NOTIFICATION_DEVICE',
    data: { userId, tokens },
  });
  // Forward update to connected SSE clients

  return { ok: true };
});
