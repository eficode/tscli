# Timesheets CLI

## Prerequisites

Set GOOGLE login information to cli and backend.

## Running

Start backend in docker:

```bash
docker-compose up -d
```

Run cli for login:

```bash
node cli.js
```

## Queries

```bash
curl -X POST -H "Content-Type: application/json" --data '{ "id_token":"test" }' http://localhost:8000/
```
