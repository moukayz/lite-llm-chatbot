# PostgreSQL Backend for ChatSession Service

This project has been expanded to support PostgreSQL as a backend database for storing chat sessions and messages.

## Setup Instructions

### Prerequisites

- PostgreSQL server running locally or accessible via network
- Node.js and npm installed

### Configuration

1. Create a `.env` file in the project root with your PostgreSQL connection string:

```
DATABASE_URL="postgresql://username:password@hostname:port/database_name"
```

For local development with default postgres setup:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lite_llm_chatbot"
```

2. Set the storage mode in `.env` to use PostgreSQL:

```
NEXT_PUBLIC_DB_STORAGE=postgres
```

Note: The `NEXT_PUBLIC_` prefix is required to make the variable accessible to client-side code.

### Database Setup

Run the setup script to create the database schema:

```bash
npm run db:setup
```

This will:
- Check and create the `.env` file if needed
- Generate the Prisma client
- Run the database migrations

## Architecture

The implementation follows a client-server architecture:

1. **Client Side**:
   - `apiChatSessionService.ts` - Makes API calls to the server endpoints
   - `chatSessionServiceFactory.ts` - Selects between localStorage and API implementations
   
2. **Server Side**:
   - API Routes - Handle HTTP requests
   - `pgChatSessionService.ts` - Interacts with PostgreSQL via Prisma

## API Endpoints

The PostgreSQL implementation exposes the following API endpoints:

### GET /api/chat/sessions
Returns all chat sessions.

### POST /api/chat/sessions
Creates a new chat session. 

Request body:
```json
{
  "messages": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi there!" }
  ]
}
```

### GET /api/chat/sessions/[id]
Returns all messages for a specific chat session.

### PUT /api/chat/sessions/[id]
Updates a chat session with new messages.

Request body:
```json
{
  "messages": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi there!" },
    { "role": "user", "content": "How are you?" }
  ]
}
```

### DELETE /api/chat/sessions/[id]
Deletes a chat session.

## Implementation Details

The implementation includes:

1. **Prisma Schema** - Defines the database models for ChatSession and Message
2. **API Routes** - Next.js API routes for CRUD operations
3. **API Client** - Client-side service for making API requests
4. **Service Factory** - A factory pattern to select between localStorage and API implementations

The application will use either the localStorage or PostgreSQL implementation based on the `NEXT_PUBLIC_DB_STORAGE` environment variable.

## File Structure

- `prisma/schema.prisma` - Database schema
- `app/lib/db.ts` - Prisma client setup
- `app/services/pgChatSessionService.ts` - PostgreSQL implementation (server-side)
- `app/services/apiChatSessionService.ts` - API client implementation (client-side)
- `app/services/chatSessionServiceFactory.ts` - Service factory
- `app/api/chat/sessions/*` - API routes
- `app/scripts/setupDb.ts` - Database setup script 