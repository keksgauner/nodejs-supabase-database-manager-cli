import inquirer from 'inquirer';
import chalk from 'chalk';
import { supabase } from '../lib/supabase.js';
import { displayTable, displayError, displaySuccess } from '../lib/display.js';

/**
 * Interactive INSERT command.
 */
export async function insertCommand() {
  console.log(chalk.blue.bold('\n── INSERT ──────────────────────────────'));

  const { tableName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'tableName',
      message: 'Table name:',
      validate: v => v.trim() !== '' || 'Table name is required',
    },
  ]);

  console.log(chalk.dim('Enter the data as a JSON object, e.g.: {"name": "Alice", "age": 30}'));
  console.log(chalk.dim('Or an array of objects for bulk insert: [{"name": "Alice"}, {"name": "Bob"}]'));

  const { jsonData } = await inquirer.prompt([
    {
      type: 'input',
      name: 'jsonData',
      message: 'Data to insert (JSON):',
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

  const { returnData } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'returnData',
      message: 'Return inserted row(s)?',
      default: true,
    },
  ]);

  let query = supabase.from(tableName.trim()).insert(data);
  if (returnData) {
    query = query.select();
  }

  const { data: result, error } = await query;

  if (error) {
    displayError(error);
  } else if (returnData && result) {
    displayTable(result);
  } else {
    displaySuccess('Record(s) inserted successfully.');
  }

  return true;
}
