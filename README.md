# Timesheets CLI

A simple CLI for Eficode Timesheets

## Prerequisites

Sign in to [Timesheets](https://timesheets.eficode.fi/) on Chrome.

## Chrome profiles

If you use multiple Chrome profiles, the CLI tries to auto-detect your work profile by looking for one signed in with an `@eficode.com` email. Auto-detect works on macOS, Linux, and Windows.

To override, set the `CHROME_PROFILE` environment variable:

    CHROME_PROFILE=your.name@eficode.com   # or "Eficode", or "Profile 2"

It accepts the account email, the profile display name, or the directory name (e.g. `Default`, `Profile 2`).

Optionally, you can put it in a `.env` file (see `.env.example`) and load it with Node ≥20.6:

    node --env-file=.env lib/cli.js

## Running

`npx @eficode/tscli`

### Listing current tasks

`npx @eficode/tscli tasks`

### Adding an hour report

`npx @eficode/tscli add <id> <duration>`
