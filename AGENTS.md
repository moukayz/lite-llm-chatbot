# AGENTS.md

## Entry Points

- The current chat flow lives under `app/chat/`: `app/chat/page.tsx` creates a session, `app/chat/[id]/page.tsx` renders and streams a conversation, and `app/chat/layout.tsx` provides `ChatSettingsProvider`, the sidebar, and model selection.
- `app/page.tsx` still renders the older `components/ChatArea.tsx` path. It does not match the newer `/chat` architecture and is part of the current repo-wide TypeScript breakage. Prefer editing `/chat/**` unless the task is explicitly about the home page.
- The chat streaming backend is `app/api/chat/route.ts`. It sends SSE chunks shaped as `data: {"text":"...","type":"thinking"|"answer"}` and ends with `data: [DONE]`. `hooks/useChat.ts` depends on that exact wire format and accumulates `thinking` and `answer` text separately.

## Provider And Model Gotchas

- The live chat route is hard-wired to DashScope: `app/api/chat/route.ts` always constructs the OpenAI SDK client with `baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"` and `config.dashscopeApiKey`. `OPENAI_API_KEY` is warned about in `config.ts` but is not used by the chat endpoint.
- Available model lists are duplicated: the active `/chat` UI uses `components/chatSettingContext.tsx`, while the legacy `/` UI has its own list in `components/ChatArea.tsx`. If a task changes model options, check both places.

## Storage And DB

- Session storage is split across two paths:
- `lib/api/chatSessionServiceFactory.ts` switches between browser `localStorage` and HTTP APIs based on `NEXT_PUBLIC_DB_STORAGE === 'postgres'`.
- `/api/chat/sessions/**` always uses Prisma/Postgres via `services/pgChatSessionService.ts`.
- `components/ChatHistory` and `hooks/useChatSession.ts` always call `/api/chat/sessions`, so the `/chat` sidebar/history assumes the Postgres API is available even when the factory is using `localStorage`.
- Prisma client output is generated into `app/generated/prisma` (`prisma/schema.prisma`) and that directory is gitignored. After schema changes, regenerate before relying on DB-backed code or type checks.
- Postgres mode needs both `DATABASE_URL` and `NEXT_PUBLIC_DB_STORAGE=postgres`.

## Commands

- Docs and scripts are npm-based: `npm install`, `npm run dev`, `npm test`, `npm run build`.
- There is no typecheck script. Use `npx tsc --noEmit`.
- Focused Jest runs work with `npm test -- --runTestsByPath hooks/__tests__/useChat.test.ts --runInBand`.
- `package.json` has a stale `db:setup` path (`app/scripts/setupDb.ts`). The actual helper is `scripts/setupDb.ts`; equivalent manual steps are `npx prisma generate` then `npx prisma migrate dev`.
- Both `package-lock.json` and `pnpm-lock.yaml` are checked in. Avoid incidental lockfile churn unless the task is explicitly about package management.

## Verification Quirks

- `npm run build` does not currently pass cleanly on `main`: the build reaches type/lint validation, then fails on the Next 15 route handler typing in `app/api/chat/sessions/[id]/route.ts` and the lint step invoked by `next lint` with the flat ESLint config.
- `npx tsc --noEmit` also has existing repo-wide failures in legacy files and tests. For feature work, prefer focused tests plus targeted inspection instead of assuming the whole repo is green.

## Import Conventions

- `tsconfig.json` sets `baseUrl: "."` and an `@/*` alias. This repo intentionally mixes `@/foo` imports with bare-root imports like `services/...`, `types/...`, and `lib/...`.
