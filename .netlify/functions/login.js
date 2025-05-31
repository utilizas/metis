// netlify/functions/login.js

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  // Usuarios y contraseñas desde variables de entorno
  const USERS = {
    [process.env.ADMIN_USER]: { password: process.env.ADMIN_PASS, role: "admin" },
    [process.env.ADMIN2_USER]: { password: process.env.ADMIN2_PASS, role: "admin" },
    [process.env.CONTRIB01_USER]: { password: process.env.CONTRIB01_PASS, role: "contributor" },
    [process.env.CONTRIB02_USER]: { password: process.env.CONTRIB02_PASS, role: "contributor" },
    // Añade más usuarios si lo necesitas
  };

  let body = {};
  try {
    body = JSON.parse(event.body || "{}");
  } catch (e) {
    // Si hay error al parsear, body se queda vacío
  }

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
