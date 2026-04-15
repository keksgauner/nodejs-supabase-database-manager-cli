import inquirer from 'inquirer';
import chalk from 'chalk';
import { supabase } from '../lib/supabase.js';
import { displayTable, displayError, displaySuccess } from '../lib/display.js';

/**
 * Interactive raw-SQL command.
 *
 * Executes a SQL query via a PostgreSQL function called `execute_sql`.
 * See the README for the function definition that must be created in your
 * database before using this command.
 */
export async function queryCommand() {
  console.log(chalk.blue.bold('\n── RAW SQL ─────────────────────────────'));
  console.log(
    chalk.yellow(
      'This command calls the "execute_sql" PostgreSQL function.\n' +
      'See README.md for the required function definition.\n'
    )
  );

  const { sqlQuery } = await inquirer.prompt([
    {
      type: 'input',
      name: 'sqlQuery',
      message: 'SQL query:',
      validate: v => v.trim() !== '' || 'SQL query is required',
    },
  ]);

  const { data, error } = await supabase.rpc('execute_sql', { query: sqlQuery.trim() });

  if (error) {
    displayError(error);
    return;
  }

  if (Array.isArray(data) && data.length > 0) {
    displayTable(data);
  } else if (data) {
    displaySuccess('Query executed successfully.');
    console.log(JSON.stringify(data, null, 2));
  } else {
    displaySuccess('Query executed successfully (no rows returned).');
  }
}
