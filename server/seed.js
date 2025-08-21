import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '..', 'data', 'US_recipes.json');

function isNaNish(v) {
  if (v === null || v === undefined) return true;
  if (typeof v === 'number') return Number.isNaN(v);
  if (typeof v === 'string') return v.trim().toLowerCase() === 'nan';
  return false;
}

function toNullNumber(v) {
  if (isNaNish(v)) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function extractCalories(nutrients) {
  if (!nutrients || typeof nutrients !== 'object') return null;
  const raw = nutrients.calories || nutrients.Calories;
  if (!raw) return null;
  const m = String(raw).match(/(\d+(\.\d+)?)/);
  return m ? Math.round(Number(m[1])) : null;
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

(async () => {
  try {
    await run(`
      CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cuisine TEXT,
        title TEXT,
        rating REAL,
        prep_time INTEGER,
        cook_time INTEGER,
        total_time INTEGER,
        description TEXT,
        nutrients TEXT,
        serves TEXT,
        calories INTEGER
      )
    `);

    await run(`DELETE FROM recipes`);

    let raw = fs.readFileSync(dataPath, 'utf-8');
    raw = raw.replace(/\bNaN\b/g, 'null');

    const json = JSON.parse(raw);
    const records = Array.isArray(json) ? json : Object.values(json);

    const insertSql = `INSERT INTO recipes
      (cuisine, title, rating, prep_time, cook_time, total_time, description, nutrients, serves, calories)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    for (const r of records) {
      const cuisine = r.cuisine ?? null;
      const title = r.title ?? null;
      const rating = toNullNumber(r.rating);
      const prep_time = toNullNumber(r.prep_time);
      const cook_time = toNullNumber(r.cook_time);
      const total_time = toNullNumber(r.total_time);
      const description = r.description ?? null;
      const nutrients = r.nutrients ? JSON.stringify(r.nutrients) : null;
      const serves = r.serves ?? null;
      const calories = extractCalories(r.nutrients);

      await run(insertSql, [
        cuisine,
        title,
        rating,
        prep_time,
        cook_time,
        total_time,
        description,
        nutrients,
        serves,
        calories
      ]);
    }

    console.log(`Seeded ${records.length} recipes into data/recipes.db`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
