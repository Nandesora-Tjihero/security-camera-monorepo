import { it as baseIt, vi } from 'vitest';

// Mocked user data
export const googleUser = {
  uid: '12345',
  displayName: 'Test User',
  email: 'testuser@gmail.com',
  photoURL: 'https://example.com/testuser.jpg',
  providerId: 'google.com',
  emailVerified: true,
};

export const testContext = {
  isAuthServiceUndefined: false,
};

export const it = baseIt.extend({
  googleUser: async ({}, use) => {
    await use(googleUser);
  },

  testContext: async ({}, use) => {
    await use(testContext);
  },
});

export const mockSignInWithGoogle = vi.fn(async () => googleUser);
export const mockConvertToScUser = vi.fn((user) => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
}));

// import { test as baseTest } from 'vitest'

// const todos = []
// const archive = []

// export const test = baseTest.extend({
//   todos: async ({}, use) => {
//     // setup the fixture before each test function
//     todos.push(1, 2, 3)

//     // use the fixture value
//     await use(todos)

//     // cleanup the fixture after each test function
//     todos.length = 0
//   },
//   archive
// })
