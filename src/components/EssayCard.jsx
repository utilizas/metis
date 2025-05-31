import React from "react";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

export default function EssayCard({ essay, onView, onDelete, isAdmin }) {
  // Protección para campos faltantes
  const title = essay.title || "Sin título";
  const author = essay.author || "Autor no especificado";
  const affiliation = essay.affiliation || "";
  const tags =
    Array.isArray(essay.tags)
      ? essay.tags.filter(Boolean)
      : typeof essay.tags === "string"
      ? essay.tags.split(/[,;]\s*/).filter(Boolean)
      : [];
  const date = essay.date || "";

  return (
    <motion.div whileHover={{ scale: 1.03 }} className="relative">
      <div className="rounded-2xl shadow p-0 overflow-hidden bg-white dark:bg-zinc-900 min-h-[220px] flex flex-col justify-between">
        <div className="p-4 pb-3 flex-1 flex flex-col">
          {/* Título */}
          <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-1 line-clamp-2 break-words">
            {title}
          </h3>
          {/* Autor y afiliación */}
          <div className="mb-1 text-zinc-700 dark:text-zinc-300 text-sm">
            <span>
              <b>Autor:</b> {author}
            </span>
            {affiliation && (
              <>
                <span className="mx-1 text-zinc-400">|</span>
                <span>
                  <b>Afiliación:</b> {affiliation}
                </span>
              </>
            )}
          </div>
          {/* Etiquetas */}
          <div className="mb-2">
            {tags.length > 0 ? (
              tags.map((tag, i) => (
                <span
                  key={tag + i}
                  className="inline-block bg-indigo-600/80 text-white text-xs px-2 py-0.5 rounded-full mr-1 mb-1 font-semibold shadow-sm"
                  style={{ letterSpacing: "0.5px" }}
                >
                  #{tag}
                </span>
              ))
            ) : (
              <span className="text-xs text-zinc-400 italic">Sin etiquetas</span>
            )}
          </div>
          {/* Fecha */}
          <div className="text-xs text-zinc-400 mt-auto">
            {date && <>Enviado: {formatDate(date)}</>}
          </div>
        </div>
        {/* Botones */}
        <div className="flex items-center px-4 pb-4">
          <button
            className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded px-2 py-1 mt-1 mr-2"
            onClick={onView}
          >
            Ver contenido
          </button>
          {isAdmin && (
            <button
              className="ml-auto"
              onClick={onDelete}
              title="Borrar ensayo"
            >
              <Trash2 className="text-red-500" size={18} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
