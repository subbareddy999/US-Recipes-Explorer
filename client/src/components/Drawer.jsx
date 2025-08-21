import { motion } from "framer-motion";
import { Flame, Timer, Utensils, X } from "lucide-react";
import React from "react";

export default function Drawer({ item, onClose }) {
  if (!item) return null;

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 80, damping: 20 }}
      className="fixed top-0 right-0 w-full sm:w-[480px] h-full bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col"
    >

      <div className="relative h-40 bg-gradient-to-r from-indigo-500 to-pink-500 text-white flex items-end px-6 pb-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/20 rounded-full p-2 hover:bg-white/30 transition"
        >
          <X size={20} />
        </button>
        <div>
          <h2 className="text-xl font-bold drop-shadow">{item.title}</h2>
          <p className="text-sm opacity-90">{item.cuisine || "Unknown Cuisine"}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <Timer className="mx-auto text-indigo-500" />
            <p className="text-sm text-gray-500">Total</p>
            <p className="font-semibold text-gray-900">
              {item.total_time ?? "—"} min
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <Utensils className="mx-auto text-pink-500" />
            <p className="text-sm text-gray-500">Serves</p>
            <p className="font-semibold text-gray-900">
              {item.serves || "—"}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <Flame className="mx-auto text-orange-500" />
            <p className="text-sm text-gray-500">Calories</p>
            <p className="font-semibold text-gray-900">
              {item.calories || "—"}
            </p>
          </div>
        </div>

        {item.description && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Description
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Nutrition</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              "carbohydrateContent",
              "cholesterolContent",
              "fiberContent",
              "proteinContent",
              "saturatedFatContent",
              "sodiumContent",
              "sugarContent",
              "fatContent",
            ].map((key) => (
              <div
                key={key}
                className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm"
              >
                <p className="text-gray-500 capitalize">
                  {key.replace("Content", "")}
                </p>
                <p className="font-medium text-gray-900">
                  {item.nutrients?.[key] ?? "—"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
