import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const posts = [
  {
    userId: 1,
    id: 1,
    title: 'first post title',
    body: 'first post body',
  },
  // ...
];

const restHandlers = [
  http.get('http://localhost:3000/dashboard', ({ cookies }) => {
    console.log(
      'Mock server received dashboard request',
      cookies.session || 'no-cookie'
    );
    return HttpResponse.json(posts);
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
