import Table from 'cli-table3';
import chalk from 'chalk';

/**
 * Renders an array of objects as a formatted table in the terminal.
 * @param {object[]} data
 */
export function displayTable(data) {
  if (!data || data.length === 0) {
    console.log(chalk.yellow('No data found.'));
    return;
  }

  const headers = Object.keys(data[0]);
  const table = new Table({
    head: headers.map(h => chalk.cyan(h)),
    wordWrap: true,
  });

  for (const row of data) {
    table.push(
      headers.map(h => {
        const val = row[h];
        if (val === null || val === undefined) return chalk.dim('NULL');
        if (typeof val === 'object') return JSON.stringify(val);
        return String(val);
      })
    );
  }

  console.log(table.toString());
  console.log(chalk.green(`\n${data.length} row(s) returned.`));
}

/**
 * Prints an error message in red.
 * @param {object} error
 */
export function displayError(error) {
  console.error(chalk.red('\nError: ') + (error.message || JSON.stringify(error)));
  if (error.details) console.error(chalk.red('Details: ') + error.details);
  if (error.hint) console.error(chalk.red('Hint: ') + error.hint);
}

/**
 * Prints a success message in green.
 * @param {string} message
 */
export function displaySuccess(message) {
  console.log(chalk.green('\n✓ ' + message));
}
