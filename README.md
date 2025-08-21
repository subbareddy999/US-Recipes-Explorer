```markdown
# 🍴 US Recipes Explorer

A modern full-stack web application to explore US recipes with search, filters, pagination, and detailed nutritional information.
Built with **Vite + React (frontend)** and **Node.js + Express + SQLite (backend)**.

---

## 🚀 Features

- Browse a large dataset of US recipes.
- Powerful search & filters:
  - Title
  - Cuisine
  - Rating
  - Total Time
  - Calories
- Pagination with adjustable page size.
- Recipe details in a **modern sliding drawer**:
  - Description
  - Quick facts (total time, serves, calories)
  - Nutrition breakdown
- Fully **responsive** (mobile, tablet, desktop).
- Clean **bright theme** with modern UI components.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), TailwindCSS, Framer Motion, Lucide Icons
- **Backend**: Node.js, Express, SQLite3
- **Database**: SQLite (seeded from `US_recipes.json`)

---

## 📂 Project Structure

recipes-assessment/
├── client/          # Frontend (Vite + React)
│   ├── src/
│   │   ├── components/   # Drawer, Table, StarRating
│   │   └── App.jsx
│   └── vite.config.js
│
├── server/          # Backend (Node + Express + SQLite)
│   ├── db.js
│   ├── index.js     # Express API
│   ├── seed.js      # Seeds DB from US\_recipes.json
│   └── US\_recipes.json
│
└── README.md

````

---

## ⚙️ Installation & Setup

### 1. Clone the repo
```bash
git clone https://github.com/subbareddy999/US-Recipes-Explorer.git
cd recipes-assessment
````

### 2. Backend Setup

```bash
cd server
npm install
npm run seed   # seeds database from US_recipes.json
npm start      # starts backend on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd ../client
npm install
npm run dev    # starts frontend on http://localhost:5173
```

---

## 🌐 API Endpoints

| Method | Endpoint                  | Description                   |
| ------ | ------------------------- | ----------------------------- |
| GET    | `/api/recipes`            | Get paginated list of recipes |
| GET    | `/api/recipes/:id`        | Get single recipe by ID       |
| GET    | `/api/recipes/search?...` | Search recipes with filters   |

### 👇🏻

Assignment submission for Securin
