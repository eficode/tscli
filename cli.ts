#!/usr/bin/env node

import yargs from 'yargs';

import { listPhases } from './src/phases';
import { findProjectsAndTasks, changeFavorite } from './src/projects';
import { listWeek, createWorktime } from './src/worktimes';

const args = yargs(process.argv.slice(2))
  .usage('Usage: npx @eficode/tscli [options]')
  .example('npx @eficode/tscli -l', 'show current hours')
  .help('h')
  .command('$0', 'List hours of current week', {}, listWeek)
  .command('tasks', 'Get current tasks', {}, listPhases)
  .command('hours <id> <duration> [date] [description]', 'mark hours for task', {}, createWorktime)
  .command('find <name>', 'find project and tasks by name', {}, findProjectsAndTasks)
  .command('favorites <action> <id>', 'add / rm a favorite', {}, changeFavorite)
  .demandCommand()
  .alias('h', 'help')
  .alias('v', 'version').argv;
