#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

const program = new Command();

const EXPENSES_FILE = path.join(__dirname, 'expenses.json');

function loadExpenses() {
  try {
    if (!fs.existsSync(EXPENSES_FILE)) {
      return [];
    }

    const data = fs.readFileSync(EXPENSES_FILE, 'utf8');

    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading files', error);
    return [];
  }
}

function saveExpense(expenses) {
  try {
    const data = JSON.stringify(expenses, null, 2);
    fs.writeFileSync(EXPENSES_FILE, data);
  } catch (error) {
    console.log('Error saving expenses', error.message);
  }
}

function generateId(expenses) {
  if (expenses.length === 0) {
    return 1;
  }

  const maxId = Math.max(...expenses.map((expense) => expense.id));
  return maxId + 1;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
}

function getMonthName(monthNumber) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[monthNumber - 1];
}

program
  .command('add')
  .description('Add an Expense')
  .requiredOption('--description <description>', 'Expense Description')
  .requiredOption('--amount <amount>', 'Expense Amount')
  .action((options) => {
    const amount = parseFloat(options.amount);
    const description = options.description.trim();

    if (isNaN(amount)) {
      console.log('Error: Amount must be a valid number');
      process.exit(1);
    }

    if (amount <= 0) {
      console.log('Error: Amount must be greater than 0');
      process.exit(1);
    }

    const expenses = loadExpenses();

    const newExpense = {
      id: generateId(expenses),
      amount,
      description,
      date: new Date().toISOString(),
    };

    expenses.push(newExpense);
    saveExpense(expenses);
    console.log(`Expense added successfully (ID: ${newExpense.id})`);
  });

program
  .command('list')
  .description('List all expenses')
  .action(() => {
    const expenses = loadExpenses();

    if (expenses.length === 0) {
      return console.log('No expenses found');
    }

    console.log('ID  Date       Description              Amount');
    console.log('--  ---------- ----------------------- --------');

    expenses.forEach((expense) => {
      const id = expense.id.toString().padEnd(2);
      const date = formatDate(expense.date).padEnd(10);
      const description = expense.description.padEnd(23);
      const amount = expense.amount.toFixed(2).padStart(8);

      console.log(`${id}  ${date} ${description} ${amount}`);
    });
  });

program
  .command('summary')
  .description('Show summary of expenses')
  .option('--month <month>', 'Show summary for specific month (1-12)')
  .action((options) => {
    const expenses = loadExpenses();

    if (expenses.length === 0) {
      return console.log('No expenses found');
    }

    let filteredExpenses = expenses;
    let summaryLabel = 'Total expenses';

    if (options.month) {
      const month = parseInt(options.month);

      if (isNaN(month) || month < 1 || month > 12) {
        console.log('Error: Month must be between 1 and 12');
        process.exit(1);
      }

      const currentYear = new Date().getFullYear();

      filteredExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() + 1 === month &&
          expenseDate.getFullYear() === currentYear
        );
      });

      summaryLabel = `Total expenses for ${getMonthName(month)}`;

      if (filteredExpenses.length === 0) {
        return console.log(`No expenses found for ${getMonthName(month)}`);
      }
    }

    const total = filteredExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    console.log(`${summaryLabel}: $${total.toFixed(2)}`);
  });

program
  .command('update')
  .description('Update expense')
  .requiredOption('--id <id>', 'Expense id to update')
  .option('--description <description>', 'Description to update')
  .option('--amount <amount>', 'Amount to update')
  .action((options) => {
    const expenseId = parseInt(options.id);

    if (isNaN(expenseId)) {
      console.log('Error: Invalid expense ID');
      process.exit(1);
    }

    const expenses = loadExpenses();
    const expenseIndex = expenses.findIndex(
      (expense) => expense.id === expenseId
    );

    if (expenseIndex === -1) {
      console.log(`Error: Expense with ID ${expenseId} not found`);
      process.exit(1);
    }

    if (!options.description && !options.amount) {
      console.log(
        'Error: Please provide at least --description or --amount to update'
      );
      process.exit(1);
    }

    if (options.description) {
      expenses[expenseIndex].description = options.description.trim();
    }

    if (options.amount) {
      const newAmount = parseFloat(options.amount);

      if (isNaN(newAmount)) {
        console.log('Error: Amount must be a valid number');
        process.exit(1);
      }

      if (newAmount <= 0) {
        console.log('Error: Amount must be greater than 0');
        process.exit(1);
      }

      expenses[expenseIndex].amount = newAmount;
    }

    saveExpense(expenses);
    console.log(`Expense updated successfully (ID: ${expenseId})`);
  });

program
  .command('delete')
  .description('Delete expense')
  .requiredOption('--id <id>', 'Expense id to delete')
  .action((options) => {
    const expenseId = parseInt(options.id);

    if (isNaN(expenseId)) {
      console.log('Error: Invalid expense ID');
      process.exit(1);
    }

    const expenses = loadExpenses();
    const expenseIndex = expenses.findIndex(
      (expense) => expense.id === expenseId
    );

    if (expenseIndex === -1) {
      console.log(`Error: Expense with ID ${expenseId} not found`);
      process.exit(1);
    }

    expenses.splice(expenseIndex, 1);
    saveExpense(expenses);
    console.log('Expense deleted successfully');
  });

program.parse();
