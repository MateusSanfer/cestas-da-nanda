const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const authController = {
  async register(req, res) {
    const { name, email, password, isAdmin } = req.body;

    try {
      // Verifica se o e-mail já está cadastrado
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "E-mail já cadastrado" });
      }

      // Criptografa a senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Cria o usuário
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        isAdmin: isAdmin || false,
      });

      res.status(201).json({
        message: "Usuário criado com sucesso",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
    } catch (error) {
      console.error("Erro no cadastro:", error);
      res.status(500).json({ error: "Erro no servidor ao registrar usuário" });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        console.log(`[LOGIN ERROR] User not found for email: ${email}`);
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      console.log(`[LOGIN DEBUG] User found: ${user.email}, ID: ${user.id}`);
      console.log(`[LOGIN DEBUG] Stored Hash: ${user.password}`);

      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log(`[LOGIN DEBUG] Password valid: ${isPasswordValid}`);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Senha incorreta" });
      }

      const token = jwt.sign(
        { userId: user.id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      res.json({
        message: "Login realizado com sucesso",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
    } catch (error) {
      console.error("Erro no login:", error);
      res.status(500).json({ error: "Erro no servidor ao realizar login" });
    }
  },
};

authController.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "isAdmin"],
    });
    res.json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
};

authController.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { isAdmin } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Evitar que o próprio admin se remova (opcional, mas recomendado)
    if (req.user.userId === user.id && isAdmin === false) {
      return res
        .status(400)
        .json({ error: "Você não pode remover seu próprio status de admin." });
    }

    user.isAdmin = isAdmin;
    await user.save();

    res.json({ message: `Status de admin atualizado para ${isAdmin}`, user });
  } catch (error) {
    console.error("Erro ao atualizar função do usuário:", error);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
};

module.exports = authController;

authController.updateProfile = async (req, res) => {
  const { name, password, newPassword } = req.body;
  const userId = req.user.userId; // Vem do middleware de autenticação

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Atualização de Nome (Limitado a 1 vez se já tiver sido alterado)
    if (name && name !== user.name) {
      if (user.hasChangedName) {
        return res.status(403).json({
          error:
            "Você já alterou seu nome uma vez. Entre em contato com o suporte.",
        });
      }
      user.name = name;
      user.hasChangedName = true;
    }

    // Atualização de Senha
    if (newPassword) {
      // Se for trocar senha, a senha atual é OBRIGATÓRIA
      if (!password) {
        return res
          .status(400)
          .json({ error: "Informe a senha atual para definir uma nova." });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Senha atual incorreta." });
      }

      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    res.json({
      message: "Perfil atualizado com sucesso!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        hasChangedName: user.hasChangedName,
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};
