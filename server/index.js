import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import db from './db.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function parseOp(value) {
  const m = String(value).match(/^(<=|>=|<|>|==|=)\s*(.+)$/);
  if (!m) return { op: '=', val: value };
  return { op: m[1] === '==' ? '=' : m[1], val: m[2] };
}

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.get('/api/recipes', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);

    const totalRow = await get('SELECT COUNT(*) as c FROM recipes');
    const total = totalRow?.c || 0;

    const rows = await all(
      `SELECT id, title, cuisine, rating, prep_time, cook_time, total_time, description, nutrients, serves, calories
       FROM recipes
       ORDER BY (rating IS NULL), rating DESC
       LIMIT ? OFFSET ?`,
      [limit, (page - 1) * limit]
    );

    res.json({
      page,
      limit,
      total,
      data: rows.map(r => ({
        ...r,
        nutrients: r.nutrients ? JSON.parse(r.nutrients) : null
      }))
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/recipes/search', async (req, res) => {
  try {
    const { title, cuisine, calories, total_time, rating } = req.query;
    const where = [];
    const params = [];

    if (title) {
      where.push('LOWER(title) LIKE ?');
      params.push(`%${String(title).toLowerCase()}%`);
    }
    if (cuisine) {
        where.push('LOWER(cuisine) LIKE ?');
        params.push(`%${String(cuisine).toLowerCase()}%`);
      }
    if (calories) {
      const { op, val } = parseOp(calories);
      where.push(`calories ${op} ?`);
      params.push(parseInt(val));
    }
    if (total_time) {
      const { op, val } = parseOp(total_time);
      where.push(`total_time ${op} ?`);
      params.push(parseInt(val));
    }
    if (rating) {
      const { op, val } = parseOp(rating);
      where.push(`rating ${op} ?`);
      params.push(parseFloat(val));
    }

    const sql = `
      SELECT id, title, cuisine, rating, prep_time, cook_time, total_time, description, nutrients, serves, calories
      FROM recipes
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY (rating IS NULL), rating DESC, id ASC
      LIMIT 200
    `;

    const rows = await all(sql, params);
    res.json({
      data: rows.map(r => ({
        ...r,
        nutrients: r.nutrients ? JSON.parse(r.nutrients) : null
      }))
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
