// middlewares/isAdmin.js

module.exports = (req, res, next) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: 'Usuário não autenticado.' });
  }

  if (!user.isAdmin) {
    return res.status(403).json({ message: 'Acesso restrito ao administrador.' });
  }

  next();
};
