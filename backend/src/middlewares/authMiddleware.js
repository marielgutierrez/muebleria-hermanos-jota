const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "hermanos_jota_jwt_secret_key_2026";

/**
 * Middleware para proteger rutas mediante autenticación JWT
 * Valida el encabezado Authorization: Bearer <token>
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Verificar que exista el encabezado de autorización
    if (!authHeader) {
      return res.status(401).json({
        message: "Acceso denegado: no se proporcionó token de autenticación",
        error: "Token ausente",
      });
    }

    // 2. Comprobar el formato Bearer
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Formato de autorización inválido. Se espera: Bearer <token>",
        error: "Formato de token inválido",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token || !token.trim()) {
      return res.status(401).json({
        message: "Acceso denegado: token vacío",
        error: "Token vacío",
      });
    }

    // 3. Validar token con la clave secreta
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtErr) {
      if (jwtErr.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "El token de autenticación ha expirado. Por favor, iniciá sesión nuevamente.",
          error: "Token expirado",
        });
      }
      return res.status(401).json({
        message: "Token de autenticación inválido",
        error: "Token inválido",
      });
    }

    // 4. Obtener la identidad del usuario desde el token y/o base de datos
    const userId = decoded.id || decoded._id;

    if (!userId) {
      return res.status(401).json({
        message: "Token inválido: no contiene información de identidad de usuario",
        error: "Payload de token inválido",
      });
    }

    // Intentar buscar el usuario en base de datos para obtener datos frescos
    const user = await User.findById(userId).select("-password");

    if (!user) {
      // Si el usuario fue eliminado de la base de datos pero el token sigue firmado
      return res.status(401).json({
        message: "El usuario asociado a este token ya no existe",
        error: "Usuario no encontrado",
      });
    }

    // 5. Adjuntar usuario a req para uso en los controladores siguientes
    req.user = user;
    next();
  } catch (error) {
    console.error("Error en authMiddleware:", error);
    return res.status(500).json({
      message: "Error interno al verificar la autenticación",
      error: error.message,
    });
  }
};

module.exports = authMiddleware;
module.exports.protect = authMiddleware;
