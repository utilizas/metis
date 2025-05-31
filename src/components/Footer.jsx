import React from "react";

export default function Footer({ footerOpen, setFooterOpen }) {
  return (
    <footer className="bg-zinc-950 text-zinc-100 px-4 py-4 text-sm flex flex-col items-center mt-6">
  <div className="w-full flex flex-col items-center">
    <button
      className="font-semibold text-zinc-300 mb-2 mx-auto"
      onClick={() => setFooterOpen(o => !o)}
    >
          Información legal {footerOpen ? "▲" : "▼"}
        </button>
        {footerOpen && (
  <div className="rounded-xl bg-zinc-800 p-4 mb-2 mx-auto max-w-2xl text-center">
    <p>
      <b>About:</b> Plataforma colaborativa gestionada por Metis &amp; unibooks.org, sin ánimo de lucro.<br />
      <b>Contacto:</b> <a href="mailto:info@unibooks.org" className="underline">info@unibooks.org</a>
    </p>
    <p className="mt-2">
      <b>Cookies y privacidad:</b> Solo se utilizan las cookies técnicas imprescindibles. No se recaban ni tratan datos personales. Cumplimiento RGPD UE 2016/679 y LOPDGDD 3/2018 (España).
    </p>
  </div>
)}
        <div className="text-center text-xs mt-2 text-zinc-400">
          © 2025 Metis - unibooks.org
        </div>
      </div>
    </footer>
  );
}
