# Security Camera

## What this project is

This is a Nuxt 3 web app that turns a spare device into a home security camera. A user uses this web app for monitoring and a companion mobile app for receiving notifications.

The web app consists of the following high-level architecture and flow:

1. User signs in with Firebase Auth (initialization lives in `plugins/01.firebaseInit.ts`).
2. The camera device captures frames and runs a browser-based [TensorFlow.js](https://www.tensorflow.org/js) object-detection model.
3. When a person is detected the device uploads the captured image to Cloud Storage for Firebase
4. A Cloud Function is triggered by the Storage upload.
5. The Cloud Function sends a FCM notification to the user’s primary mobile device. (storage -> cloud function -> notification) facilitated by native app made with [NativeScript](https://nativescript.org/) (not included in this repository, see note below).

> 💡 **Related projects**
>
> The [mobile app with NativeScript](../mobile/)

> [Firebase Cloud Functions](../backend/) for notifications

## Pricing

The app implements subscriptions and billing through Stripe with a 14-day free trial. The relevant code is located in:

1. Client helpers: `plugins/stripeClient.js`
2. Server endpoints: `server/api/subscriptions/*`

## Stack used

- **Detection**: TensorFlow.js (browser-based) object-detection model
- **Fullstack**: Nuxt 3, Vue 3, NuxtUI, TailwindCSS
- **Testing**: Vitest, [Firebase Emulators](https://firebase.google.com/docs/emulator-suite),
- **Backend / serverless**: Nitro server routes (`server/api/*`) and Firebase Cloud Functions (in `sec-funcs/`)
- **Firebase**: Auth, Firestore, Storage, Cloud Messaging (FCM) & Cloud Functions
- **Payments**: Stripe

## Notable files / symbols (quick reference)

- Auth init & helper: `plugins/01.firebaseInit.ts`
- Firestore helpers: `plugins/03.firebaseFirestore.client.ts`
- Cloud function helpers: `sec-funcs/utils/onObjectFinalized.js`
- Server-side notification helper: `server/utils/sendNotificationRequestWithUserIdAndImgUR.ts`
- Stripe helpers and endpoints: `plugins/stripeClient.js`, `server/api/subscriptions/*`

## Roadmap

This project is a Work In Progress (WIP) and more improvements will be continually added. These improvements include:

- Clean and optimized code
- Error handling
- Dockerization for easier deployment
- More feature tests, and integration tests
- Performance optimizations
- Payment plan options and management UI

## How to run

### Prerequisites

- Node.js v18 or later
- To run with your own credentials, create a [Firebase project](https://firebase.google.com/docs/android/setup#create-firebase-project) and get configuration data for your platforms(e.g web, iOS, Android). Then replace the demo values in the `.env.example` file and rename the file to `.env`.
- A Stripe account for handling subscriptions and billing (you can use test mode for development), and the [Stripe CLI](https://stripe.com/docs/stripe-cli) installed.

### Installation

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/Ombuweb/security-camera.git
cd security-camera

# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
```

2. Set up environment variables:
   Create a `.env` file in the root directory and add the necessary environment variables. You can refer to the `.env.example` file for the required variables.

```bash
# Example .env
NUXT_PUBLIC_FIREBASE_API_KEY=...
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
STRIPE_SECRET_KEY=...
```

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## License

MIT © 2025 Ombuweb  
See [LICENSE](./LICENSE) for details.
