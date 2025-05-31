exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  // Usuarios y contraseñas desde variables de entorno
  const USERS = {};
  if (process.env.ADMIN_USER && process.env.ADMIN_PASS)
    USERS[process.env.ADMIN_USER] = { password: process.env.ADMIN_PASS, role: "admin" };
  if (process.env.ADMIN2_USER && process.env.ADMIN2_PASS)
    USERS[process.env.ADMIN2_USER] = { password: process.env.ADMIN2_PASS, role: "admin" };
  if (process.env.CONTRIB01_USER && process.env.CONTRIB01_PASS)
    USERS[process.env.CONTRIB01_USER] = { password: process.env.CONTRIB01_PASS, role: "contributor" };
  if (process.env.CONTRIB02_USER && process.env.CONTRIB02_PASS)
    USERS[process.env.CONTRIB02_USER] = { password: process.env.CONTRIB02_PASS, role: "contributor" };

  console.log("USERS:", USERS);

  let body = {};
  try {
    body = JSON.parse(event.body || "{}");
  } catch (e) {}

  console.log("Request body:", body);

  const { username, password } = body;

  if (!username || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing fields" }),
    };
  }

  const user = USERS[username];
  if (user && user.password === password) {
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, username, role: user.role }),
    };
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify({ ok: false, error: "Credenciales incorrectas" }),
    };
  }
};
