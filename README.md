# Timesheets CLI

A simple CLI for Eficode Timesheets

## Prerequisites

Sign in to [Timesheets](https://timesheets.eficode.fi/) on Chrome.

## Chrome profiles

If you use multiple Chrome profiles, the CLI tries to auto-detect your work profile by looking for one signed in with an `@eficode.com` email. To override, set `CHROME_PROFILE` in a `.env` file (see `.env.example`):

    CHROME_PROFILE=your.name@eficode.com   # or "Eficode", or "Profile 2"

It accepts the account email, the profile display name, or the directory name.

## Running

`npx @eficode/tscli`

### Listing current tasks

`npx @eficode/tscli tasks`

### Adding an hour report

`npx @eficode/tscli add <id> <duration>`
