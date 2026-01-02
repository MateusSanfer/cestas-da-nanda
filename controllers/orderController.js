const { Order, OrderItem, Basket, User } = require("../models");

module.exports = {
  async index(req, res) {
    try {
      const orders = await Order.findAll({
        include: [
          { model: OrderItem, include: [Basket] },
          { model: User, attributes: ["id", "name", "email"] },
        ],
        order: [["createdAt", "DESC"]],
      });

      const parsedOrders = orders.map((order) => {
        const o = order.toJSON();
        if (typeof o.deliveryAddress === "string") {
          try {
            o.deliveryAddress = JSON.parse(o.deliveryAddress);
          } catch (e) {
            console.error("Erro ao analisar o endereço:", e);
          }
        }
        return o;
      });

      res.json(parsedOrders);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar pedidos" });
    }
  },

  async userIndex(req, res) {
    try {
      console.log("Debug userIndex - req.user:", req.user); // DEBUG LOG

      if (!req.user || !req.user.userId) {
        console.log("Debug userIndex - Unauthorized: Missing userId");
        return res
          .status(401)
          .json({ error: "Usuário não autenticado (ID ausente)" });
      }

      const orders = await Order.findAll({
        where: { userId: req.user.userId },
        include: [{ model: OrderItem, include: [Basket] }],
        order: [["createdAt", "DESC"]],
      });

      const parsedOrders = orders.map((order) => {
        const o = order.toJSON();
        if (typeof o.deliveryAddress === "string") {
          try {
            o.deliveryAddress = JSON.parse(o.deliveryAddress);
          } catch (e) {
            console.error("Erro ao analisar o endereço:", e);
          }
        }
        return o;
      });
      res.json(parsedOrders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar seus pedidos" });
    }
  },

  async store(req, res) {
    try {
      const {
        userId,
        items,
        deliveryAddress,
        deliveryDate,
        deliveryPeriod,
        paymentMethod,
        message,
      } = req.body;

      // 1. Calculate total (simplified for now, ideally should validate prices from DB)
      let total = 0;
      // Note: In production, fetch Basket prices here to prevent frontend manipulation

      // 2. Create Order
      const order = await Order.create({
        userId,
        total: req.body.total, // For MVP trust frontend or calculate
        status: "pending",
        deliveryAddress,
        deliveryDate,
        deliveryPeriod,
        paymentMethod,
        message,
      });

      // 3. Create OrderItems
      for (const item of items) {
        await OrderItem.create({
          orderId: order.id,
          basketId: item.basketId,
          quantity: item.quantity,
          extras: item.extras, // JSON
          subtotal: item.subtotal,
        });
      }

      res.status(201).json(order);
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      console.error(error.stack);
      res
        .status(500)
        .json({ error: "Erro ao criar pedido", details: error.message });
    }
  },

  async update(req, res) {
    try {
      const { status } = req.body;
      const order = await Order.findByPk(req.params.id);
      if (!order)
        return res.status(404).json({ error: "Pedido não encontrado" });

      await order.update({ status });
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar pedido" });
    }
  },
};
