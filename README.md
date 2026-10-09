# 💸 YAET

> ~~Yet Another Expense Tracker~~
> **YAET Ain't Excel, Thanks**
> 
> *Pronounced "yeet". Or "yet". I don't judge.*
> 
> A minimal, opinionated expense tracker focused on what actually matters.

![status](https://img.shields.io/badge/status-active-success)
![license](https://img.shields.io/badge/license-MIT-blue)

## ✨ Why This Exists

Most expense trackers try to do everything, and end up adding noise.

This project takes a different approach:
- Focus on **debit transactions**
- Treat **cash as optional**
- Prioritize **insight over completeness**

Built out of necessity, and for the joy of tinkering.

---

## 🔑 Features

- 📥 **CSV Import**  
  Load transactions directly from your bank exports.

- 🔄 **Smart Deduplication**  
  Re-import your bank CSV as many times as you want. Duplicates are automatically ignored.
  - No need to manually filter or clean files
  - Handles tricky cases like multiple transactions with identical name, value, and date (e.g., several €20 "dinner" payments)

- 💳 **Debit-Centric Tracking**  
  Designed for card-based spending analysis.

- ✂️ **Flexible Expense Splitting**  
  Break down transactions into multiple categories:
  - Example: €100 withdrawal → €20 groceries, €30 concert tickets, €50 untracked leisure
  - You can re-split or recombine these entries at any time

- 🔗 **Expense Merging (Netting Transactions)**  
  Combine related expenses and income into a single meaningful entry.
  - Example:
    - €100 dinner (you paid)
    - 4 × €20 Bizum/Venmo repayments  
    → Merge into: **"Dinner: -€20"**
  - Helps reflect the *real* cost instead of raw cash flow

- 🧩 **Composable Transactions**  
  Split → merge → split again.  
  Transactions are flexible and can be reshaped as your understanding evolves.

- 💵 **Optional Cash Tracking**  
  Track cash only if it adds value to you.

---

## 🧠 Philosophy

> Not all data is useful data.

In practice:
- Most cash spending tends to be low-signal (e.g., leisure)
- Categorizing every small expense adds friction without insight
- Raw transaction logs ≠ meaningful financial understanding

This tracker embraces:
- Simplicity
- Intentional tracking
- Practical decision-making

---

## 📊 Workflow

1. Export CSV from your bank
2. Import into the tracker (no cleanup needed)
3. Let the system ignore duplicates automatically
4. Split or merge transactions where it adds clarity
5. Ignore the rest

---

## ⚖️ Trade-offs

- No automatic bank integration
- No real-time sync
- Cash tracking is manual by design
- Requires occasional manual curation (by choice, not necessity)

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/<your-username>/yaet-expense-tracker.git
cd yaet-expense-tracker

# Install dependencies
<your-install-command>

# Run the app
<your-run-command>
```

---

## 📄 License

MIT
