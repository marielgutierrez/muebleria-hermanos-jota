const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "hermanos_jota_jwt_secret_key_2026";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Generar token JWT con la identidad del usuario
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * POST /api/auth/register
 * Registra un nuevo usuario
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validar campos obligatorios
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Por favor completá todos los campos obligatorios (nombre, email y contraseña)",
        error: "Campos incompletos",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos 6 caracteres",
        error: "Contraseña muy corta",
      });
    }

    // 2. Validar que el email no esté registrado previamente
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        message: "El correo electrónico ya se encuentra registrado",
        error: "Email duplicado",
      });
    }

    // 3. Crear usuario (la contraseña se hashea con el hook pre-save de User)
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    const token = generateToken(user);

    // 4. Respuesta de éxito respetando el contrato acordado sin exponer la contraseña
    return res.status(201).json({
      message: "Usuario registrado con éxito",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message, error: error.message });
    }
    return next(error);
  }
};

/**
 * POST /api/auth/login
 * Iniciar sesión y obtener token JWT
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Por favor ingresá email y contraseña",
        error: "Credenciales incompletas",
      });
    }

    // Buscar al usuario por email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        message: "Credenciales inválidas: correo electrónico o contraseña incorrectos",
        error: "Usuario no encontrado",
      });
    }

    // Comparar contraseña con el hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Credenciales inválidas: correo electrónico o contraseña incorrectos",
        error: "Contraseña incorrecta",
      });
    }

    const token = generateToken(user);

    // Respuesta según contrato de integración B (pág. 13)
    return res.status(200).json({
      message: "Login exitoso",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /api/auth/me
 * Obtener datos del usuario actualmente autenticado
 */
const getMe = async (req, res) => {
  return res.status(200).json({
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
};

module.exports = {
  register,
  login,
  getMe,
  generateToken,
};
