#!/usr/bin/env node
/**
 * Standalone raw SQL script
 * Run with:  npm run query  (or node src/query.js)
 */

import chalk from 'chalk';
import { queryCommand } from './commands/queryCmd.js';

queryCommand().catch(err => {
  console.error(chalk.red('\nFatal error:'), err.message ?? err);
  process.exit(1);
});
