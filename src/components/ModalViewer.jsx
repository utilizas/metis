import React, { useEffect } from "react";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

export default function ModalViewer({ essay, onClose }) {
  // Permite cerrar el modal con Escape
  useEffect(() => {
    function onEsc(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  // Permite cerrar haciendo clic fuera del modal
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl max-w-2xl w-full overflow-y-auto max-h-[90vh] shadow-2xl relative">
        <button
          className="absolute top-3 right-4 text-2xl font-bold text-zinc-500 hover:text-red-500"
          onClick={onClose}
          aria-label="Cerrar"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-1">{essay.title}</h2>
        <div className="mb-2 text-sm text-zinc-500">
          por <b>{essay.author}</b> | {formatDate(essay.date)}
        </div>
        <div className="mb-2">
          {essay.tags?.map(tag => (
            <span key={tag} className="inline-block bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-xl mr-1 font-semibold">
              #{tag}
            </span>
          ))}
          <span className="inline-block ml-2 text-xs font-mono text-zinc-400">{essay.ext.toUpperCase()}</span>
        </div>
        <hr className="my-2" />
        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: essay.bodyHtml }}
        />
      </div>
    </div>
  );
}
