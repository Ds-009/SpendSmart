import { createClient } from '@supabase/supabase-js';
import pool from './db.js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error('Missing Supabase env vars for API auth verification');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const ensureMysqlUser = async (email, displayName) => {
  const [rows] = await pool.query(
    'SELECT user_id FROM users WHERE email = ? LIMIT 1',
    [email]
  );

  if (rows.length > 0) {
    return rows[0].user_id;
  }

  const name = displayName?.trim() || email.split('@')[0] || 'User';
  const [insertResult] = await pool.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, 'SUPABASE_AUTH']
  );

  return insertResult.insertId;
};

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing Bearer token' });
      return;
    }

    const token = authHeader.slice('Bearer '.length).trim();
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user?.email) {
      res.status(401).json({ error: 'Invalid auth token' });
      return;
    }

    const mysqlUserId = await ensureMysqlUser(
      data.user.email,
      (data.user.user_metadata?.name ?? data.user.user_metadata?.full_name ?? '')
    );

    req.mysqlUserId = mysqlUserId;
    req.authUser = {
      id: data.user.id,
      email: data.user.email,
    };

    next();
  } catch (error) {
    res.status(500).json({ error: 'Auth mapping failed', details: error.message });
  }
};
