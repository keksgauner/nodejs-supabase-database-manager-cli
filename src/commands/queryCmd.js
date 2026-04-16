import inquirer from 'inquirer';
import chalk from 'chalk';
import { runSqlQuery } from '../lib/postgres.js';
import { displayTable, displayError, displaySuccess } from '../lib/display.js';

/**
 * Interactive raw-SQL command.
 *
 * Executes a SQL query via a direct PostgreSQL connection.
 */
export async function queryCommand() {
  console.log(chalk.blue.bold('\n── RAW SQL ─────────────────────────────'));
  console.log(
    chalk.yellow(
      'This command runs directly against your Postgres database using SUPABASE_DB_URL.\n'
    )
  );

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Choose an option:',
      choices: [
        { name: 'Enter SQL query', value: 'run' },
        { name: 'Back to main menu', value: 'back' },
      ],
    },
  ]);

  if (action === 'back') {
    return false;
  }

  const { sqlQuery } = await inquirer.prompt([
    {
      type: 'input',
      name: 'sqlQuery',
      message: 'SQL query:',
      validate: v => v.trim() !== '' || 'SQL query is required',
    },
  ]);

  try {
    const data = await runSqlQuery(sqlQuery.trim());

    if (Array.isArray(data) && data.length > 0) {
      displayTable(data);
    } else {
      displaySuccess('Query executed successfully (no rows returned).');
    }

    return true;
  } catch (error) {
    displayError(error);
    return true;
  }
}
