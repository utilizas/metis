// /api/login.js
export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // ¡Sólo aquí defines los usuarios!
  const USERS = {
    admin: { password: "admin123", role: "admin" },
    contributor01: { password: "pass01", role: "contributor" },
    contributor02: { password: "pass02", role: "contributor" },
    // ...
  };

  const { username, password } = req.body || {};

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
