# Timesheets CLI

A simple CLI for Eficode Timesheets

## Prerequisites

Create a file `.session` which has the session cookies from your browser session.

## Running

`npx @eficode/tscli`

### Listing current tasks

`npx @eficode/tscli tasks`

### Adding an hour report

`npx @eficode/tscli create <id> <duration>`

## Websocket Auth Concept

This repository includes a concept for authentication in browser using CLI. If the session does not exist, this app will open a browser for OAuth login, and simultaneously opens a websocket to the backend. Once OAuth succeeds, the backend returns the session information through the websocket.

`backend` includes a simple server that has websockets and Google OAuth enabled.

## Running

Start backend in docker:

```bash
docker-compose up -d
```

Run cli for login:

```bash
ts-node cli.js login
```
