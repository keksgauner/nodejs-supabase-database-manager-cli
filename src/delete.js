#!/usr/bin/env node
/**
 * Standalone DELETE script
 * Run with:  npm run delete  (or node src/delete.js)
 */

import chalk from 'chalk';
import { deleteCommand } from './commands/deleteCmd.js';

try {
  await deleteCommand();
} catch (err) {
  console.error(chalk.red('\nFatal error:'), err.message ?? err);
  process.exit(1);
}
