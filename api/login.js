<<<<<<< HEAD
// /api/login.js
=======
>>>>>>> 2283730ce0201792581eba93299bc4b5e1668029
export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

<<<<<<< HEAD
  // ¡Sólo aquí defines los usuarios!
  const USERS = {
    admin: { password: "admin123", role: "admin" },
    contributor01: { password: "pass01", role: "contributor" },
    contributor02: { password: "pass02", role: "contributor" },
    // ...
  };

  const { username, password } = req.body || {};
=======
  // Recupera usuarios y contraseñas solo de variables de entorno
  const USERS = {
    [process.env.ADMIN_USER]: { password: process.env.ADMIN_PASS, role: "admin" },
    [process.env.CONTRIB01_USER]: { password: process.env.CONTRIB01_PASS, role: "contributor" },
    [process.env.CONTRIB02_USER]: { password: process.env.CONTRIB02_PASS, role: "contributor" },
    // Añade más usuarios según lo necesites
  };

  let body = req.body;
  // Si deployas en Vercel, puede que sea string y no JSON ya
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const { username, password } = body || {};
>>>>>>> 2283730ce0201792581eba93299bc4b5e1668029

  if (!username || !password) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }

  const user = USERS[username];
  if (user && user.password === password) {
    res.status(200).json({ ok: true, username, role: user.role });
  } else {
    res.status(401).json({ ok: false, error: "Credenciales incorrectas" });
  }
}
