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

program.parse();
