import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Search, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import Drawer from "./components/Drawer";
import RecipesTable from "./components/RecipesTable";

const DEFAULT_LIMIT = 15;

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  const [filters, setFilters] = useState({
    title: "",
    cuisine: "",
    rating: "",
    total_time: "",
    calories: "",
  });

  const hasAnyFilter = useMemo(
    () => Object.values(filters).some((v) => String(v || "").trim() !== ""),
    [filters]
  );

  async function fetchPage() {
    setLoading(true);
    try {
      if (hasAnyFilter) {
        const q = new URLSearchParams();
        for (const [k, v] of Object.entries(filters)) {
          if (String(v || "").trim() !== "") q.set(k, v);
        }
        const res = await fetch(`/api/recipes/search?${q.toString()}`);
        const json = await res.json();
        setRecipes(json.data || []);
        setTotal(json.data?.length || 0);
        setPage(1);
      } else {
        const res = await fetch(`/api/recipes?page=${page}&limit=${limit}`);
        const json = await res.json();
        setRecipes(json.data || []);
        setTotal(json.total || 0);
      }
    } catch (e) {
      console.error(e);
      setRecipes([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPage();
  }, [page, limit]);

  useEffect(() => {
    const t = setTimeout(fetchPage, 300);
    return () => clearTimeout(t);
  }, [filters]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <motion.h1
            className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            >
            US Recipes Explorer
    </motion.h1>

<div className="mt-6 flex flex-wrap gap-3 items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
  <Search className="text-gray-500" />
  <input
    className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-full sm:w-auto"
    placeholder="Title contains..."
    value={filters.title}
    onChange={(e) => setFilters((f) => ({ ...f, title: e.target.value }))}
  />
  <input
    className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-full sm:w-auto"
    placeholder="Cuisine"
    value={filters.cuisine}
    onChange={(e) => setFilters((f) => ({ ...f, cuisine: e.target.value }))}
  />
  <input
    className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-full sm:w-auto"
    placeholder="Rating (>=4.5)"
    value={filters.rating}
    onChange={(e) => setFilters((f) => ({ ...f, rating: e.target.value }))}
  />
  <input
    className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-full sm:w-auto"
    placeholder="Total Time (<=60)"
    value={filters.total_time}
    onChange={(e) => setFilters((f) => ({ ...f, total_time: e.target.value }))}
  />
  <input
    className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-full sm:w-auto"
    placeholder="Calories (<=400)"
    value={filters.calories}
    onChange={(e) => setFilters((f) => ({ ...f, calories: e.target.value }))}
  />
  {hasAnyFilter && (
    <button
      className="ml-auto flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
      onClick={() =>
        setFilters({
          title: "",
          cuisine: "",
          rating: "",
          total_time: "",
          calories: "",
        })
      }
    >
      <X size={14} /> Clear filters
    </button>
  )}
</div>


      <div className="mt-6 bg-white rounded-xl shadow-md overflow-hidden border">
        <RecipesTable rows={recipes} loading={loading} onRowClick={setSelected} />

        {!loading && recipes.length === 0 && (
  <div className="p-10 text-center text-gray-600">
    <h3 className="text-lg font-semibold">No results found 😕</h3>
    <p className="text-sm">Try adjusting your filters or search again.</p>
  </div>
)}


<div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-white">
  <div className="text-sm text-gray-600">
    Showing {recipes.length} of {total}
  </div>
  <div className="flex gap-2 items-center">
    <select
      className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      value={limit}
      onChange={(e) => setLimit(parseInt(e.target.value))}
    >
      {[15, 20, 25, 30, 40, 50].map((n) => (
        <option key={n} value={n}>
          {n} / page
        </option>
      ))}
    </select>
    <button
      className="px-3 py-1 rounded-md border border-gray-300 bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 transition disabled:opacity-40"
      onClick={() => setPage((p) => Math.max(1, p - 1))}
      disabled={page === 1 || hasAnyFilter}
    >
      <ArrowLeft size={16} />
    </button>
    <span className="text-gray-700 text-sm">Page {page}</span>
    <button
      className="px-3 py-1 rounded-md border border-gray-300 bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 transition disabled:opacity-40"
      onClick={() => setPage((p) => p + 1)}
      disabled={page * limit >= total || hasAnyFilter}
    >
      <ArrowRight size={16} />
    </button>
  </div>
</div>

      </div>

      <AnimatePresence>
        {selected && <Drawer item={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
