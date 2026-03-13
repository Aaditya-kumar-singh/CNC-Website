# Frontend

This frontend now includes basic Appwrite client setup alongside the existing API integration.

## Appwrite Setup

1. Copy `.env.example` to `.env` if you want a single local env file, or keep using `.env.development` / `.env.production`.
2. Appwrite values already added:
   - `VITE_APPWRITE_PROJECT_ID=69b448c400190bca1da8`
   - `VITE_APPWRITE_PROJECT_NAME=cncmarket`
   - `VITE_APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1`
3. Install dependencies:

```bash
npm install
```

4. Run the app:

```bash
npm run dev
```

5. Open `/appwrite-setup` and click `Send a Ping` to verify the Appwrite endpoint is reachable.

## Files Added

- `src/lib/appwrite.js`
- `src/pages/AppwriteSetup.jsx`
- `.env.example`
