# Expense Tracker CLI

A simple command-line expense tracker built with Node.js to help you manage your personal finances.

## ✨ Features

- Add new expenses with description and amount
- List all expenses in a formatted table
- Update existing expenses (description, amount, or both)
- Delete expenses by ID
- View expense summaries (total and monthly)
- Data persistence with JSON file storage
- Input validation and error handling

## 🚀 Installation

1. **Clone or download the project**
   ```bash
   git clone https://github.com/nikusha1446/expense-tracker-cli.git
   cd expense-tracker-cli
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Make the script executable (Unix/Mac):**
   ```bash
   chmod +x index.js
   ```

## 📖 Usage

### Add Expense
Add a new expense with description and amount:
```bash
node index.js add --description "Lunch" --amount 20
node index.js add --description "Coffee" --amount 5.50
```

### List Expenses
Display all expenses in a formatted table:
```bash
node index.js list
```

**Example Output:**
```
ID Date       Description               Amount
-- ---------- ----------------------- --------
1  2025-09-18 Lunch                    20.00
2  2025-09-18 Coffee                    5.50
```

### Update Expense
Update an existing expense by ID. You can update description, amount, or both:
```bash
# Update description only
node index.js update --id 1 --description "Expensive lunch"

# Update amount only
node index.js update --id 1 --amount 25

# Update both
node index.js update --id 1 --description "Very expensive lunch" --amount 30
```

### Delete Expense
Remove an expense by ID:
```bash
node index.js delete --id 1
```

### View Summary
Show total expenses:
```bash
node index.js summary
```

Show expenses for a specific month (current year):
```bash
node index.js summary --month 9  # September
node index.js summary --month 12 # December
```

**Example Output:**
```
Total expenses: $45.50
Total expenses for September: $25.50
```

## 📚 Command Reference

| Command | Description | Options |
|---------|-------------|---------|
| `add` | Add a new expense | `--description <desc>` `--amount <amount>` |
| `list` | List all expenses | None |
| `update` | Update existing expense | `--id <id>` `--description <desc>` `--amount <amount>` |
| `delete` | Delete an expense | `--id <id>` |
| `summary` | Show expense summary | `--month <1-12>` (optional) |

## 💾 Data Storage

- Expenses are stored in `expenses.json` in the same directory as the script
- Each expense includes: ID, date, description, and amount
- The JSON file is created automatically when you add your first expense

## 📦 Dependencies

- `commander` - Command-line argument parsing
