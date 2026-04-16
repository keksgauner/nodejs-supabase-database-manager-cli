import inquirer from 'inquirer';
import chalk from 'chalk';
import { supabase } from '../lib/supabase.js';
import { displayTable, displayError, displaySuccess } from '../lib/display.js';

/**
 * Interactive DELETE command.
 */
export async function deleteCommand() {
  console.log(chalk.blue.bold('\n── DELETE ──────────────────────────────'));

  const { tableName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'tableName',
      message: 'Table name:',
      validate: v => v.trim() !== '' || 'Table name is required',
    },
  ]);

  console.log(chalk.dim('Specify the WHERE condition to identify which records to delete.'));

  const { filterColumn, filterValue } = await inquirer.prompt([
    {
      type: 'input',
      name: 'filterColumn',
      message: 'Filter column (e.g., id):',
      validate: v => v.trim() !== '' || 'Column name is required',
    },
    {
      type: 'input',
      name: 'filterValue',
      message: 'Filter value:',
      validate: v => v.trim() !== '' || 'Filter value is required',
    },
  ]);

  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: chalk.yellow(
        `Delete all records from "${tableName}" where ${filterColumn} = "${filterValue}"?`
      ),
      default: false,
    },
  ]);

  if (!confirmed) {
    console.log(chalk.dim('Delete cancelled.'));
    return true;
  }

  const { returnData } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'returnData',
      message: 'Return deleted row(s)?',
      default: false,
    },
  ]);

  let query = supabase.from(tableName.trim()).delete().eq(filterColumn.trim(), filterValue.trim());
  if (returnData) {
    query = query.select();
  }

  const { data: result, error } = await query;

  if (error) {
    displayError(error);
  } else if (returnData && result) {
    displayTable(result);
  } else {
    displaySuccess('Record(s) deleted successfully.');
  }

  return true;
}
