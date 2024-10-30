# Rate Limited API

This is a Node.js API that implements task processing with rate limiting and logging using MongoDB.

## Features

- Rate limiting: 1 task per second and 20 tasks per minute per user.
- Queueing system to manage tasks.
- Logging of task completion in a file.

## Installation

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Ensure MongoDB is running.
4. Create a `logs` directory for log storage.
5. Start the server with `node server.js`.

## Testing

You can test the API with the following curl command:

```bash
curl -X POST http://localhost:3000/api/v1/task -H "Content-Type: application/json" -d '{"user_id": "123"}'
