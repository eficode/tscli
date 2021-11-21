#!/usr/bin/env node

import yargs from 'yargs';

import * as timesheets from './src/timesheets';

const args = yargs(process.argv.slice(2))
  .usage('Usage: npx @eficode/tscli [options]')
  .example('npx @eficode/tscli -l', 'show current hours')
  .help('h')
  .command('tasks',
    'Get current tasks',
    timesheets.listPhases
  )
  .command('create <id> <duration> [date] [description]',
    'mark hours for task',
    timesheets.createWorktime
  )
  .demandCommand()
  .alias('h', 'help')
  .alias('v', 'version')
  .argv;
