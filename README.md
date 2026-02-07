# nobzo-evaluation-blog-api

A simple Blog REST API implemented with Node.js, Express, MongoDB, and Mongoose.

## Features

- User registration & login (JWT authentication)
- Create, read, update, soft-delete posts
- Slug generation for posts
- Pagination, search, tag and author filtering
- Centralized error handling

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create a `.env` file based on `.env.example` and set the values:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

3. Run the app in development:

```bash
pnpm run dev
```

## Required environment variables

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret used to sign JWTs
- `PORT` - Port to run the server on

## API Endpoints

- `POST /api/auth/register` — register a user (body: `name`, `email`, `password`)
- `POST /api/auth/login` — login (body: `email`, `password`)
- `POST /api/posts` — create post (auth required)
- `GET /api/posts` — list published posts (supports `page`, `limit`, `search`, `tag`, `author`, `status` for authenticated users)
- `GET /api/posts/:slug` — get single published post
- `PUT /api/posts/:id` — update post (author only)
- `DELETE /api/posts/:id` — soft delete post (author only)

## Sample requests

Register:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"secret"}'
```

Login:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret"}'
```

Create post (replace TOKEN):

```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"Hello","content":"World","tags":["intro"],"status":"draft"}'
```

## Notes

- The project expects `MONGODB_URI`, `JWT_SECRET`, and `PORT` to be provided via environment variables.
- The `/api/posts` GET route accepts an Authorization header optionally; authenticated users can filter by `status` and see their drafts.
