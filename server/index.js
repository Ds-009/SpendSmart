import cors from 'cors';
import express from 'express';
import pool from './db.js';
import { requireAuth } from './auth.js';
import {
  buildSavingsPlanFromInput,
  detectOverspending,
  generateMonthlyReport,
  normalizeTransactions,
  recurringToMonthly,
} from './aiService.js';

const app = express();
const port = Number(process.env.API_PORT ?? 3001);

app.use(cors());
app.use(express.json());

const fetchUserTransactions = async (userId) => {
  const [rows] = await pool.query(
    `SELECT
      t.transaction_id,
      t.amount,
      t.description,
      t.date,
      c.name AS category_name,
      c.type AS category_type
    FROM transactions t
    INNER JOIN categories c ON c.category_id = t.category_id
    WHERE t.user_id = ?
    ORDER BY t.date DESC, t.transaction_id DESC`,
    [userId]
  );

  return normalizeTransactions(rows);
};

const resolveCategoryId = async (userId, categoryName, type) => {
  const [existing] = await pool.query(
    `SELECT category_id
    FROM categories
    WHERE name = ?
      AND type = ?
      AND (user_id = ? OR user_id IS NULL)
    ORDER BY user_id IS NULL, category_id
    LIMIT 1`,
    [categoryName, type, userId]
  );

  if (existing.length > 0) {
    return existing[0].category_id;
  }

  const [insertResult] = await pool.query(
    'INSERT INTO categories (user_id, name, type) VALUES (?, ?, ?)',
    [userId, categoryName, type]
  );

  return insertResult.insertId;
};

const fetchTransactionById = async (transactionId) => {
  const [rows] = await pool.query(
    `SELECT
      t.transaction_id,
      t.amount,
      t.description,
      t.date,
      c.name AS category_name,
      c.type AS category_type
    FROM transactions t
    INNER JOIN categories c ON c.category_id = t.category_id
    WHERE t.transaction_id = ?
    LIMIT 1`,
    [transactionId]
  );

  return normalizeTransactions(rows)[0];
};

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.get('/api/transactions', requireAuth, async (req, res) => {
  try {
    const transactions = await fetchUserTransactions(req.mysqlUserId);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions', details: error.message });
  }
});

app.post('/api/transactions', requireAuth, async (req, res) => {
  try {
    const userId = req.mysqlUserId;
    const description = String(req.body.description ?? '').trim();
    const amount = Number(req.body.amount ?? 0);
    const date = String(req.body.date ?? '');
    const type = req.body.type === 'income' ? 'income' : 'expense';
    const category = String(req.body.category ?? (type === 'income' ? 'Income' : 'Other')).trim();

    if (!description || !date || !Number.isFinite(amount) || amount <= 0) {
      res.status(400).json({ error: 'Invalid transaction payload' });
      return;
    }

    const categoryId = await resolveCategoryId(userId, category, type);

    const [insertResult] = await pool.query(
      `INSERT INTO transactions (user_id, category_id, amount, description, date)
      VALUES (?, ?, ?, ?, ?)`,
      [userId, categoryId, amount, description, date]
    );

    const transaction = await fetchTransactionById(insertResult.insertId);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transaction', details: error.message });
  }
});

app.put('/api/transactions/:transactionId', requireAuth, async (req, res) => {
  try {
    const userId = req.mysqlUserId;
    const transactionId = Number(req.params.transactionId);

    if (!Number.isFinite(transactionId)) {
      res.status(400).json({ error: 'Invalid transaction id' });
      return;
    }

    const description = String(req.body.description ?? '').trim();
    const amount = Number(req.body.amount ?? 0);
    const date = String(req.body.date ?? '');
    const type = req.body.type === 'income' ? 'income' : 'expense';
    const category = String(req.body.category ?? (type === 'income' ? 'Income' : 'Other')).trim();

    if (!description || !date || !Number.isFinite(amount) || amount <= 0) {
      res.status(400).json({ error: 'Invalid transaction payload' });
      return;
    }

    const [ownershipRows] = await pool.query(
      'SELECT transaction_id FROM transactions WHERE transaction_id = ? AND user_id = ? LIMIT 1',
      [transactionId, userId]
    );

    if (ownershipRows.length === 0) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    const categoryId = await resolveCategoryId(userId, category, type);

    await pool.query(
      `UPDATE transactions
       SET category_id = ?, amount = ?, description = ?, date = ?
       WHERE transaction_id = ? AND user_id = ?`,
      [categoryId, amount, description, date, transactionId, userId]
    );

    const transaction = await fetchTransactionById(transactionId);
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update transaction', details: error.message });
  }
});

app.delete('/api/transactions/:transactionId', requireAuth, async (req, res) => {
  try {
    const userId = req.mysqlUserId;
    const transactionId = Number(req.params.transactionId);

    if (!Number.isFinite(transactionId)) {
      res.status(400).json({ error: 'Invalid transaction id' });
      return;
    }

    const [result] = await pool.query(
      'DELETE FROM transactions WHERE transaction_id = ? AND user_id = ?',
      [transactionId, userId]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transaction', details: error.message });
  }
});

app.get('/api/ai/monthly-report', requireAuth, async (req, res) => {
  try {
    const transactions = await fetchUserTransactions(req.mysqlUserId);
    const report = generateMonthlyReport(transactions);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate monthly report', details: error.message });
  }
});

app.post('/api/ai/savings-plan', requireAuth, async (req, res) => {
  try {
    const userId = req.mysqlUserId;
    const goalName = String(req.body.goalName ?? 'Trip');
    const targetAmount = Number(req.body.targetAmount ?? 0);
    const months = Number(req.body.months ?? 1);

    const [rows] = await pool.query(
      `SELECT rt.amount, rt.frequency
      FROM recurring_transactions rt
      INNER JOIN categories c ON c.category_id = rt.category_id
      WHERE rt.user_id = ?
      AND c.type = 'expense'
      AND (rt.end_date IS NULL OR rt.end_date >= CURDATE())`,
      [userId]
    );

    const recurringMonthlySpend = rows.reduce(
      (acc, item) => acc + recurringToMonthly(Number(item.amount), item.frequency),
      0
    );

    const plan = buildSavingsPlanFromInput({
      goalName,
      targetAmount,
      months,
      recurringMonthlySpend,
    });

    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to build savings plan', details: error.message });
  }
});

app.get('/api/ai/overspending-alerts', requireAuth, async (req, res) => {
  try {
    const userId = req.mysqlUserId;
    const persist = String(req.query.persist ?? 'false').toLowerCase() === 'true';
    const transactions = await fetchUserTransactions(userId);
    const alerts = detectOverspending(transactions);

    if (persist && alerts.length > 0) {
      await Promise.all(
        alerts.map((alert) =>
          pool.query('INSERT INTO notifications (user_id, message, is_read) VALUES (?, ?, 0)', [
            userId,
            alert.message,
          ])
        )
      );
    }

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to detect overspending alerts', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
