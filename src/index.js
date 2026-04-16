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

async function waitForMenuConfirmation() {
  await inquirer.prompt([
    {
      type: 'input',
      name: 'continue',
      message: 'Press Enter to return to the main menu.',
    },
  ]);
}

async function mainMenu() {
  while (true) {
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
          new inquirer.Separator(),
          { name: '❌  Exit',                                 value: 'exit' },
        ],
      },
    ]);

    let shouldWaitForConfirmation = false;

    switch (action) {
      case 'select': shouldWaitForConfirmation = await selectCommand(); break;
      case 'insert': shouldWaitForConfirmation = await insertCommand(); break;
      case 'update': shouldWaitForConfirmation = await updateCommand(); break;
      case 'delete': shouldWaitForConfirmation = await deleteCommand(); break;
      case 'exit':
        console.log(chalk.blue('\nGoodbye! 👋\n'));
        process.exit(0);
    }

    if (shouldWaitForConfirmation) {
      await waitForMenuConfirmation();
    }
  }
}

try {
  await mainMenu();
} catch (err) {
  console.error(chalk.red('\nFatal error:'), err.message ?? err);
  process.exit(1);
}
