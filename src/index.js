#!/usr/bin/env node
/**
 * Interactive Supabase Database Manager
 *
 * Run with:  npm start  (or node src/index.js)
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import { selectCommand } from './commands/selectCmd.js';
import { insertCommand } from './commands/insertCmd.js';
import { updateCommand } from './commands/updateCmd.js';
import { deleteCommand } from './commands/deleteCmd.js';
import { queryCommand } from './commands/queryCmd.js';

async function mainMenu() {
  console.log(chalk.blue.bold('\n╔══════════════════════════════════════╗'));
  console.log(chalk.blue.bold('║   Supabase Database Manager  v1.0.0  ║'));
  console.log(chalk.blue.bold('╚══════════════════════════════════════╝\n'));

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Choose an operation:',
      choices: [
        { name: '📋  SELECT  – Query data from a table',    value: 'select' },
        { name: '➕  INSERT  – Add new record(s)',          value: 'insert' },
        { name: '✏️   UPDATE  – Modify existing record(s)', value: 'update' },
        { name: '🗑️   DELETE  – Remove record(s)',          value: 'delete' },
        { name: '💻  SQL     – Execute raw SQL via RPC',    value: 'sql' },
        new inquirer.Separator(),
        { name: '❌  Exit',                                 value: 'exit' },
      ],
    },
  ]);

  switch (action) {
    case 'select': await selectCommand(); break;
    case 'insert': await insertCommand(); break;
    case 'update': await updateCommand(); break;
    case 'delete': await deleteCommand(); break;
    case 'sql':    await queryCommand();  break;
    case 'exit':
      console.log(chalk.blue('\nGoodbye! 👋\n'));
      process.exit(0);
  }

  const { again } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'again',
      message: 'Return to main menu?',
      default: true,
    },
  ]);

  if (again) {
    await mainMenu();
  } else {
    console.log(chalk.blue('\nGoodbye! 👋\n'));
    process.exit(0);
  }
}

mainMenu().catch(err => {
  console.error(chalk.red('\nFatal error:'), err.message ?? err);
  process.exit(1);
});
