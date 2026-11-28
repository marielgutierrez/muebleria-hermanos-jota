const User = require("../models/User");
const jwt = require("jsonwebtoken");

let bcrypt;
try {
  bcrypt = require("bcrypt");
} catch {
  bcrypt = require("bcryptjs");
}

const JWT_SECRET = process.env.JWT_SECRET || "hermanos_jota_jwt_secret_key_2026";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

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

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validar datos obligatorios
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
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
        message: "El email ya está registrado",
        error: "Email duplicado",
      });
    }

    // 3. Hashear la contraseña con bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Guardar el usuario en MongoDB
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });
    await newUser.save();

    const token = generateToken(newUser);

    // 5. Devolver respuesta compatible con Contrato A y B sin exponer contraseña
    return res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
      user: {
        id: newUser._id,
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message, error: error.message });
    }
    return res.status(500).json({
      message: "Error en el servidor al registrar usuario",
      error: error.message,
    });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validar datos obligatorios
    if (!email || !password) {
      return res.status(400).json({
        message: "Email y contraseña obligatorios",
        error: "Credenciales incompletas",
      });
    }

    // 2. Buscar al usuario
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        message: "Credenciales inválidas",
        error: "Usuario no encontrado",
      });
    }

    // 3. Comparar contraseña ingresada con el hash guardado
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Credenciales inválidas",
        error: "Contraseña incorrecta",
      });
    }

    // 4. Generar JWT
    const token = generateToken(user);

    // 5. Devolver token e información pública del usuario (Contrato B pág. 13)
    return res.status(200).json({
      message: "Login exitoso",
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error en el servidor al iniciar sesión",
      error: error.message,
    });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  return res.status(200).json({
    user: {
      id: req.user._id,
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
