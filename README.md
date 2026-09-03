# CalorieTap — Single Node.js Backend

This version serves the CalorieTap frontend and API from one Node.js/Express app. The OpenAI API key is read only from the server environment and is never placed in `index.html`.

## Project structure

```text
CalorieTap-Node/
├── server.js
├── package.json
├── .env.example
├── .gitignore
└── public/
    └── index.html
```

## Run locally

1. Install Node.js 18+.
2. Open a terminal in this folder.
3. Run `npm install`.
4. Set your environment variable:

macOS/Linux:
```bash
export OPENAI_API_KEY="sk-..."
```

Windows PowerShell:
```powershell
$env:OPENAI_API_KEY="sk-..."
```

5. Run:
```bash
npm start
```
6. Open `http://localhost:3000`.

You can also copy `.env.example` to `.env` if your chosen host provides dotenv support; this app intentionally does not load `.env` automatically so secrets are not accidentally committed. Configure environment variables through your hosting provider instead.

## Deploying

Deploy this entire project to a Node.js-compatible host. Set `OPENAI_API_KEY` in that host's server-side environment/secret settings. Do not put the key in `public/index.html`.

The frontend calls `/api/analyze-food`, so no separate frontend URL or backend URL is needed.

## Important

OpenAI API usage can incur charges. Hosting may have a free tier, but the OpenAI API itself is not automatically free.
