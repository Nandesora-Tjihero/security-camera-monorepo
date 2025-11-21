import { http, HttpResponse, sse } from 'msw';
import { setupServer } from 'msw/node';

const userId = 'user-123';
const tokens = ['token-abc', 'token-def'];

const restHandlers = [
  sse<{ REGISTER_NOTIFICATION_DEVICE: { userId: string; tokens: string[] } }>(
    '/api/sse/:userId',
    ({ client }) => {
      client.send({
        event: 'REGISTER_NOTIFICATION_DEVICE',
        data: { userId, tokens },
      });

      queueMicrotask(() => {
        client.close();
      });
    }
  ),
  http.get('http://localhost:3000/dashboard', ({ cookies }) => {
    console.log(
      'Mock server received dashboard request',
      cookies.session || 'no-cookie'
    );
    return HttpResponse.json([]);
  }),
  http.post(
    'http://localhost:3000/api/session-login',
    async ({ request, cookies }) => {
      console.log(
        'Mock server received session-login request',
        cookies.session || 'no-cookie'
      );
      // Return a mock session response
      return HttpResponse.json({
        success: true,
        user: { uid: '12345', email: 'testuser@gmail.com' },
      });
    }
  ),
];

const server = setupServer(...restHandlers);

export { restHandlers, server };
