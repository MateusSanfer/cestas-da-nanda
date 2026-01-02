const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("Middleware Debug - Auth Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Middleware Debug - Missing or Malformed Header");
    return res.status(401).json({ error: "Token ausente ou malformado" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Middleware Debug - Token extract:", token ? "Exists" : "Empty");

  try {
    const decoded = jwt.verify(token, secret);
    console.log("Middleware Debug - Decoded:", decoded);

    req.user = decoded; // salva os dados decodificados no req
    next();
  } catch (err) {
    console.log("Middleware Debug - Verification Failed:", err.message);
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res
      .status(403)
      .json({ error: "Acesso negado: somente administradores" });
  }
  next();
}

module.exports = {
  authenticate,
  requireAdmin,
};
