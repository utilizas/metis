export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Recoge usuarios/contraseñas solo de variables de entorno
  const USERS = {};
  if (process.env.ADMIN_USER && process.env.ADMIN_PASS) {
    USERS[process.env.ADMIN_USER] = { password: process.env.ADMIN_PASS, role: "admin" };
  }
  if (process.env.CONTRIB01_USER && process.env.CONTRIB01_PASS) {
    USERS[process.env.CONTRIB01_USER] = { password: process.env.CONTRIB01_PASS, role: "contributor" };
  }
  // Añade más usuarios según necesites

  // Maneja el body, que puede llegar como string en Vercel
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const { username, password } = body || {};

  if (!username || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const user = USERS[username];
  if (user && user.password === password) {
    return res.status(200).json({ ok: true, username, role: user.role });
  } else {
    return res.status(401).json({ ok: false, error: "Credenciales incorrectas" });
  }
}
