#!/usr/bin/env node
/**
 * Standalone INSERT script
 * Run with:  npm run insert  (or node src/insert.js)
 */

import chalk from 'chalk';
import { insertCommand } from './commands/insertCmd.js';

insertCommand().catch(err => {
  console.error(chalk.red('\nFatal error:'), err.message ?? err);
  process.exit(1);
});
