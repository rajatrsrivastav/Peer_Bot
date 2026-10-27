# PeerBot

PeerBot is a Next.js application for creating focused AI chatbots from custom instructions and context. It supports email/password and Google authentication, chatbot create/update/delete flows, a public chatbot gallery, and Gemini-powered conversations.

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` with the following values:

```dotenv
MONGO_URL=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.1-flash-lite
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
```

`GEMINI_MODEL` and the Google OAuth values are optional. Email/password authentication works without Google OAuth, and users can validate and store their own Gemini key locally at `/set-api-key`.

3. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For a local mentor demo, if `mongod` is installed, run the one-command isolated mode instead:

```bash
npm run demo
```

Demo mode starts a temporary local database and removes it when the process stops. It does not use or modify the configured cloud database.

## Demo flow

1. Create an account or sign in.
2. Open the dashboard and create a chatbot with a name and trusted context.
3. Use **Chat** to ask a question that the context can answer.
4. Return to the dashboard to update or delete the chatbot.
5. Open **Explore** to view all community chatbots.

## Quality checks

```bash
npm run lint
npm run build
```

Before a demo, verify that MongoDB is reachable and make one test request to Gemini. Provider availability and quotas are external dependencies.

## Deployment

Configure the same environment variables in the hosting platform. For Google OAuth, add the deployed application URL and callback URL to the OAuth client configuration.
