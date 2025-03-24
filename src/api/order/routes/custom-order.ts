module.exports = {
  routes: [
    {
      method: "POST",
      path: "/orders/create-and-pay",
      handler: "order.createAndPay",
      config: {
        policies: [], // Добавьте сюда нужные политики (например, для аутентификации пользователя)
      },
    },
    {
      method: "POST",
      path: "/orders/order-status",
      handler: "order.orderStatus",
    },
  ],
};
