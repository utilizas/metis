import React, { useState, useRef } from "react";
import EssayCard from "./components/EssayCard";
import Footer from "./components/Footer";
import ModalViewer from "./components/ModalViewer";
import { Moon, Sun, FilePlus2 } from "lucide-react";
import { THEMES } from "./theme";
import { remark } from "remark";
import remarkHtml from "remark-html";
import yaml from "js-yaml";

export default function App() {
  const [theme, setTheme] = useState("dark");
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState("");
  const [login, setLogin] = useState({ username: "", password: "" });
  const [essays, setEssays] = useState(
    () => JSON.parse(localStorage.getItem("essays") || "[]")
  );
  const [selected, setSelected] = useState(null);
  const fileInput = useRef();
  const [footerOpen, setFooterOpen] = useState(false);
  const [search, setSearch] = useState(""); // estado de búsqueda

  async function handleLogin(e) {
    e.preventDefault();
    setAuthError("");
    try {
      const resp = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: login.username,
          password: login.password
        })
      });
      const data = await resp.json();
      if (data.ok) {
        setUser({ name: data.username, role: data.role });
        setAuthError("");
      } else {
        setAuthError("Credenciales incorrectas.");
      }
    } catch (err) {
      setAuthError("Error de conexión.");
    }
  }

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
    document.documentElement.classList.toggle("dark");
  }

  async function handleFiles(files) {
    for (let f of files) {
      let text = await f.text();
      let ext = f.name.split(".").pop().toLowerCase();
      let content = text;
      let title = f.name.replace(/\.[^.]+$/, "");
      let date = new Date().toISOString();
      let author = user?.name || "Sin autor";
      let tags = [];
      let affiliation = "";
      let bodyHtml = "";

      // Extracción de metadatos YAML (robusta, soporta arrays y strings)
      if (["md", "qmd", "rmd"].includes(ext) && /^---/.test(text)) {
        let match = text.match(/^---([\s\S]*?)---([\s\S]*)$/);
        if (match) {
          let y;
          try {
            y = yaml.load(match[1]);
          } catch (e) {
            y = {};
          }
          title = y.title || title;
          author = y.author || author;
          affiliation = y.affiliation || "";
          if (Array.isArray(y.tags)) {
            tags = y.tags;
          } else if (typeof y.tags === "string") {
            tags = y.tags.split(/[,;]\s*/).map(t => t.trim()).filter(Boolean);
          }
          if (y.date) date = y.date;
          content = match[2] || text;
        }
      }

      if (["md", "qmd", "rmd"].includes(ext)) {
        const file = await remark().use(remarkHtml).process(content);
        bodyHtml = String(file);
      } else if (ext === "html") {
        bodyHtml = content;
      } else {
        bodyHtml = "<pre>" + content + "</pre>";
      }

      let essay = {
        id: Date.now() + Math.random(),
        title,
        author,
        tags,
        affiliation,
        ext,
        date,
        bodyHtml
      };

      setEssays((prev) => {
        let updated = [essay, ...prev].slice(0, 100);
        localStorage.setItem("essays", JSON.stringify(updated));
        return updated;
      });
    }
  }

  function handleDrop(ev) {
    ev.preventDefault();
    if (user) handleFiles(ev.dataTransfer.files);
  }

  function handleFileInput(ev) {
    handleFiles(ev.target.files);
  }

  function deleteEssay(id) {
    if (window.confirm("¿Borrar este ensayo?")) {
      setEssays((prev) => {
        let updated = prev.filter((e) => e.id !== id);
        localStorage.setItem("essays", JSON.stringify(updated));
        return updated;
      });
    }
  }

  // Búsqueda optimizada: solo título, autor, afiliación, etiquetas
  const essaysFiltrados = essays.filter(e => {
    const texto =
      (e.title || "") +
      " " +
      (e.author || "") +
      " " +
      (e.affiliation || "") +
      " " +
      ((e.tags && Array.isArray(e.tags)) ? e.tags.join(" ") : "");
    return texto.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className={`${THEMES[theme]} min-h-screen flex flex-col`}>
      {/* Barra superior */}
      <header className="flex flex-col md:flex-row items-center justify-between px-6 py-3 shadow bg-zinc-950">
        <div>
          <h1 className="text-2xl font-bold">Ensayos, notas y comentarios académicos</h1>
          <p className="text-sm text-zinc-400">Plataforma colaborativa sobre trabajos y debates en curso</p>
          <div className="mt-2 flex gap-4">
            <a
              href="/plantilla-metadatos.md"
              download
              className="underline text-indigo-400 hover:text-indigo-600"
              title="Descargar plantilla de metadatos"
            >
              Descargar plantilla (.md)
            </a>
            <a
              href="/instrucciones-envio.md"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-indigo-400 hover:text-indigo-600"
              title="Ver instrucciones para el envío de documentos"
            >
              Instrucciones para autores
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 md:mt-0">
          <button
            className="rounded p-2 hover:bg-zinc-800"
            onClick={toggleTheme}
            title={theme === "dark" ? "Tema claro" : "Tema oscuro"}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {!user && (
            <form className="flex gap-2" onSubmit={handleLogin}>
              <input
                type="text"
                required
                placeholder="usuario"
                className="rounded px-2"
                value={login.username}
                onChange={e => setLogin(l => ({ ...l, username: e.target.value }))}
                style={{ width: 110 }}
              />
              <input
                type="password"
                required
                placeholder="contraseña"
                className="rounded px-2"
                value={login.password}
                onChange={e => setLogin(l => ({ ...l, password: e.target.value }))}
                style={{ width: 110 }}
              />
              <button type="submit" className="rounded bg-zinc-700 text-white px-2 py-1">Acceder</button>
            </form>
          )}
          {user && (
            <span className="text-zinc-300 text-sm">
              {user.role === "admin" ? "Administrador" : "Colaborador"}: {user.name}
              <button
                className="ml-2 px-2 py-1 rounded bg-zinc-800 text-zinc-300"
                onClick={() => setUser(null)}
              >Salir</button>
            </span>
          )}
        </div>
      </header>
      {/* Zona de drop/upload */}
      <main className="flex-1 flex flex-col items-center p-6" onDrop={handleDrop} onDragOver={ev => ev.preventDefault()}>
        {authError && <div className="text-red-500 mb-3">{authError}</div>}
        {/* Barra de búsqueda */}
        <div className="w-full max-w-3xl mb-6 flex flex-col items-center">
          <input
            type="text"
            placeholder="Buscar por título, autor, afiliación o etiquetas..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="mb-4 px-4 py-2 rounded-lg border border-zinc-400 focus:outline-none w-full"
          />
          {user && (
            <div className="flex gap-4 items-center mb-2">
              <button
                onClick={() => fileInput.current.click()}
                className="flex items-center bg-zinc-200 text-zinc-800 rounded px-3 py-1 hover:bg-zinc-300"
              >
                <FilePlus2 className="inline mr-2" size={18} /> Subir archivo (.md, .rmd, .qmd, .html)
              </button>
              <input
                type="file"
                accept=".md,.html,.qmd,.rmd"
                multiple
                hidden
                ref={fileInput}
                onChange={handleFileInput}
              />
              <span className="text-zinc-400">O arrastra aquí los archivos</span>
            </div>
          )}
        </div>
        {/* Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl items-stretch">
          {essaysFiltrados.slice(0, 6).map(essay => (
            <EssayCard
              key={essay.id}
              essay={essay}
              onView={() => setSelected(essay)}
              onDelete={() => deleteEssay(essay.id)}
              isAdmin={user?.role === "admin"}
            />
          ))}
        </div>
      </main>
      {selected && <ModalViewer essay={selected} onClose={() => setSelected(null)} />}
      <Footer footerOpen={footerOpen} setFooterOpen={setFooterOpen} />
    </div>
  );
}
