#!/usr/bin/env node
/**
 * Standalone UPDATE script
 * Run with:  npm run update  (or node src/update.js)
 */

import chalk from 'chalk';
import { updateCommand } from './commands/updateCmd.js';

try {
  await updateCommand();
} catch (err) {
  console.error(chalk.red('\nFatal error:'), err.message ?? err);
  process.exit(1);
}
