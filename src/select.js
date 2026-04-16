#!/usr/bin/env node
/**
 * Standalone SELECT script
 * Run with:  npm run select  (or node src/select.js)
 */

import chalk from 'chalk';
import { selectCommand } from './commands/selectCmd.js';

try {
  await selectCommand();
} catch (err) {
  console.error(chalk.red('\nFatal error:'), err.message ?? err);
  process.exit(1);
}
