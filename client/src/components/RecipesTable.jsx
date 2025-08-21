import React from "react";
import StarRating from "./StarRating";

export default function RecipesTable({ rows, loading, onRowClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            <th className="px-4 py-3 text-left">Title</th>
            <th className="px-4 py-3">Cuisine</th>
            <th className="px-4 py-3">Rating</th>
            <th className="px-4 py-3">Total Time</th>
            <th className="px-4 py-3">Serves</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loading ? (
            <tr>
              <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                Loading...
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr
                key={r.id}
                className="hover:bg-indigo-50 cursor-pointer transition"
                onClick={() => onRowClick(r)}
              >
                <td className="px-4 py-3 text-gray-900 font-medium">
                  {r.title}
                </td>
                <td className="px-4 py-3 text-gray-700">{r.cuisine}</td>
                <td className="px-4 py-3">
                  <StarRating value={r.rating} />
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {r.total_time ?? "—"} mins
                </td>
                <td className="px-4 py-3 text-gray-700">{r.serves || "—"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
