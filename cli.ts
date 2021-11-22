#!/usr/bin/env node

import yargs from 'yargs';

import { listWeek, listPhases, createWorktime } from './src/timesheets';
import { login } from './src/auth';

yargs(process.argv.slice(2))
  .usage('Usage: npx @eficode/tscli [options]')
  .example('npx @eficode/tscli -l', 'show current hours')
  .help('h')
  .command('$0', 'List hours of current week', {},
    listWeek
  )
  .command('tasks', 'Get current tasks', {},
    listPhases
  )
  .command('create <id> <duration> [date] [description]', 'mark hours for task', {},
    createWorktime
  )
  .command('login', 'open browser for login', {},
    login
  )
  .demandCommand()
  .alias('h', 'help')
  .alias('v', 'version')
  .argv;
