require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const authRoutes = require("./routes/auth");

const cors = require("cors");
app.use(cors());

// Middleware para aceitar JSON
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));

// ✅ Rotas da API
app.use("/api/baskets", require("./routes/basketRoutes"));
app.use("/api/orders", require("./routes/orders"));
app.use("/auth", authRoutes);

// ✅ Servir arquivos estáticos do React
const buildPath = path.join(__dirname, "build");
app.use(express.static(buildPath));

// Rota de Emergência para Admin
app.get("/admin-fix-secret", async (req, res) => {
  const email = req.query.email;
  if (!email)
    return res.send("Por favor, informe o email na URL: ?email=seu@email.com");

  try {
    const { User } = require("./models");
    const user = await User.findOne({ where: { email } });

    if (!user) return res.send(`Usuário ${email} não encontrado.`);

    await user.update({ isAdmin: true });
    res.send(
      `SUCESSO! Usuário ${user.name} (${user.email}) agora é ADMIN. Tente fazer login.`
    );
  } catch (error) {
    res.status(500).send("Erro: " + error.message);
  }
});

// Redirecionar qualquer outra rota para o React
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// Iniciar o servidor
// Iniciar o servidor e sincronizar o banco
const PORT = process.env.PORT || 3001;
const db = require("./models");

db.sequelize
  .sync()
  .then(() => {
    console.log("Banco de dados sincronizado");
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Falha ao sincronizar banco de dados:", err);
  });
