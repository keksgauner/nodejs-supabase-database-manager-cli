import inquirer from 'inquirer';
import chalk from 'chalk';
import { supabase } from '../lib/supabase.js';
import { displayTable, displayError } from '../lib/display.js';

/**
 * Applies a single filter object to a Supabase query builder and returns the
 * updated query.
 */
function applyFilter(query, { column, operator, value }) {
  switch (operator) {
    case 'eq':    return query.eq(column, value);
    case 'neq':   return query.neq(column, value);
    case 'gt':    return query.gt(column, value);
    case 'gte':   return query.gte(column, value);
    case 'lt':    return query.lt(column, value);
    case 'lte':   return query.lte(column, value);
    case 'like':  return query.like(column, value);
    case 'ilike': return query.ilike(column, value);
    case 'is':
      return query.is(column, value === 'null' ? null : value === 'true');
    case 'in':
      return query.in(column, value.split(',').map(v => v.trim()));
    default:      return query;
  }
}

/**
 * Interactively collects one or more filter conditions from the user.
 */
async function collectFilters() {
  const filters = [];
  let addMore = true;

  while (addMore) {
    const filter = await inquirer.prompt([
      {
        type: 'input',
        name: 'column',
        message: 'Filter column:',
        validate: v => v.trim() !== '' || 'Column name is required',
      },
      {
        type: 'list',
        name: 'operator',
        message: 'Operator:',
        choices: [
          { name: 'eq   – equal to',              value: 'eq' },
          { name: 'neq  – not equal to',           value: 'neq' },
          { name: 'gt   – greater than',           value: 'gt' },
          { name: 'gte  – greater than or equal',  value: 'gte' },
          { name: 'lt   – less than',              value: 'lt' },
          { name: 'lte  – less than or equal',     value: 'lte' },
          { name: 'like – pattern match',          value: 'like' },
          { name: 'ilike – case-insensitive pattern', value: 'ilike' },
          { name: 'is   – NULL / boolean check',   value: 'is' },
          { name: 'in   – one of (comma-separated)', value: 'in' },
        ],
      },
      {
        type: 'input',
        name: 'value',
        message: 'Value (for "in" use comma-separated list):',
      },
    ]);

    filters.push(filter);

    const { more } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'more',
        message: 'Add another filter?',
        default: false,
      },
    ]);
    addMore = more;
  }

  return filters;
}

/**
 * Interactive SELECT command.
 */
export async function selectCommand() {
  console.log(chalk.blue.bold('\n── SELECT ──────────────────────────────'));

  const { tableName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'tableName',
      message: 'Table name:',
      validate: v => v.trim() !== '' || 'Table name is required',
    },
  ]);

  const { columns } = await inquirer.prompt([
    {
      type: 'input',
      name: 'columns',
      message: 'Columns to select (comma-separated, or * for all):',
      default: '*',
    },
  ]);

  let query = supabase.from(tableName.trim()).select(columns.trim());

  const { addFilter } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'addFilter',
      message: 'Add WHERE filter(s)?',
      default: false,
    },
  ]);

  if (addFilter) {
    const filters = await collectFilters();
    for (const filter of filters) {
      query = applyFilter(query, filter);
    }
  }

  const { addOrder } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'addOrder',
      message: 'Add ORDER BY?',
      default: false,
    },
  ]);

  if (addOrder) {
    const { orderColumn, direction } = await inquirer.prompt([
      {
        type: 'input',
        name: 'orderColumn',
        message: 'Order by column:',
        validate: v => v.trim() !== '' || 'Column name is required',
      },
      {
        type: 'list',
        name: 'direction',
        message: 'Direction:',
        choices: ['ASC', 'DESC'],
        default: 'ASC',
      },
    ]);
    query = query.order(orderColumn.trim(), { ascending: direction === 'ASC' });
  }

  const { addLimit } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'addLimit',
      message: 'Add LIMIT?',
      default: false,
    },
  ]);

  if (addLimit) {
    const { limit } = await inquirer.prompt([
      {
        type: 'input',
        name: 'limit',
        message: 'Row limit:',
        default: '100',
        validate: v => !isNaN(parseInt(v, 10)) || 'Enter a valid number',
      },
    ]);
    query = query.limit(parseInt(limit, 10));
  }

  const { data, error } = await query;

  if (error) {
    displayError(error);
  } else {
    displayTable(data);
  }
}
