import inquirer from 'inquirer';
import chalk from 'chalk';
import { supabase } from '../lib/supabase.js';
import { displayTable, displayError, displaySuccess } from '../lib/display.js';

/**
 * Interactive UPDATE command.
 */
export async function updateCommand() {
  console.log(chalk.blue.bold('\n── UPDATE ──────────────────────────────'));

  const { tableName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'tableName',
      message: 'Table name:',
      validate: v => v.trim() !== '' || 'Table name is required',
    },
  ]);

  console.log(chalk.dim('Enter the columns to update as a JSON object, e.g.: {"status": "active", "score": 99}'));

  const { jsonData } = await inquirer.prompt([
    {
      type: 'input',
      name: 'jsonData',
      message: 'Update data (JSON):',
      validate: v => {
        try {
          JSON.parse(v);
          return true;
        } catch {
          return 'Invalid JSON – please check your input and try again.';
        }
      },
    },
  ]);

  const data = JSON.parse(jsonData);

  console.log(chalk.dim('Specify the WHERE condition to identify which records to update.'));

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

  const { returnData } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'returnData',
      message: 'Return updated row(s)?',
      default: true,
    },
  ]);

  let query = supabase.from(tableName.trim()).update(data).eq(filterColumn.trim(), filterValue.trim());
  if (returnData) {
    query = query.select();
  }

  const { data: result, error } = await query;

  if (error) {
    displayError(error);
  } else if (returnData && result) {
    displayTable(result);
  } else {
    displaySuccess('Record(s) updated successfully.');
  }
}
