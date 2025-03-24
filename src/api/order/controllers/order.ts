/**
 * order controller
 */

import { factories } from "@strapi/strapi";

const customerCode = process.env.MERCHANT_CUSTOMER_CODE;
const redirectUrl = process.env.MERCHANT_REDIRECT_URL;
const merchantId = process.env.MERCHANT_ID;
const apiUrl = process.env.MERCHANT_URL;
const apiVersion = process.env.MERCHANT_VERSION;
const accessToken = process.env.MERCHANT_ACCESS_TOKEN;

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({
    // Создание заказа

    async createAndPay(ctx) {
      try {
        // 1. Получаем детали заказа из тела запроса (ctx.request.body)
        const orderDetails = ctx.request.body;
        const orderDetailsData = ctx.request.body.data;

        if (
          !orderDetailsData.fullName ||
          !orderDetailsData.mail ||
          !orderDetailsData.phone ||
          !orderDetailsData.products.length ||
          !orderDetailsData.delivery.city ||
          !orderDetailsData.delivery.street ||
          !orderDetailsData.delivery.house ||
          !orderDetailsData.sum ||
          !orderDetailsData.total
        ) {
          console.error("Invalid order data. Missing fields.");
          return ctx.badRequest("Invalid order data. Missing fields.");
        }
        const orderData = {
          data: {
            ...orderDetailsData,
            orderStatus: "CREATED",
            operationId: null,
          },
        };
        console.log("orderData", orderData);

        // 2. Создаем новый объект заказа в коллекции orders
        const createOrderResponse = await strapi
          .service("api::order.order")
          .create({
            ...orderData,
          });

        console.log("order created -", createOrderResponse);

        if (!createOrderResponse) {
          return ctx.internalServerError("Failed to create order");
        }

        // 3. Формируем данные для запроса к API мерчанта
        const merchantApiData = {
          Data: {
            amount: orderDetailsData.total,
            purpose: `BERKANA. Оплата заказа - ${createOrderResponse.documentId}`,
            paymentMode: ["sbp", "card"],
            redirectUrl: `${redirectUrl}/payment?order=${createOrderResponse.documentId}`,
            customerCode,
            merchantId,
          },
        };

        // 4. Отправляем запрос к API мерчанта
        const merchantApiUrl = `${apiUrl}/acquiring/${apiVersion}/payments`;
        const merchantApiKey = accessToken;

        const response = await fetch(merchantApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${merchantApiKey}`,
          },
          body: JSON.stringify(merchantApiData),
        });

        const merchantResponse: any = await response.json();

        // 5. Обрабатываем ответ от API мерчанта
        if (response.ok && merchantResponse.Data.paymentLink) {
          // Успешно получили ссылку для оплаты
          const paymentUrl = merchantResponse.Data.paymentLink;
          const operationId = merchantResponse.Data.operationId;

          console.log(paymentUrl);
          console.log(operationId);

          // Сохраняем operationId в ордере
          const updateOrderResponse = await strapi
            .service("api::order.order")
            .update(createOrderResponse.documentId, {
              data: {
                operationId,
              },
            });

          // console.log(updateOrderResponse);

          if (!updateOrderResponse) {
            return ctx.internalServerError(
              "Failed to update operationId order"
            );
          }

          // 6. Возвращаем ссылку для оплаты на фронтенд
          ctx.body = { paymentUrl: paymentUrl };
        } else {
          // Обработка ошибок от API мерчанта
          console.error("Error from Merchant API:", merchantResponse);

          return ctx.badRequest({
            error: merchantResponse,
            message: "Payment processing failed.",
          });
        }
      } catch (err) {
        console.error("Error in createAndPay:", err);
        ctx.internalServerError(
          "An error occurred while processing the payment."
        );
      }
    },

    // Проверка статуса оплаты от мерчанта и обновление статуса в БД

    async orderStatus(ctx) {
      try {
        const orderId = ctx.request.body.orderId;
        console.log(orderId);

        const order = await strapi.service("api::order.order").findOne(orderId);

        if (order) {
          if (order.orderStatus === "PAID") {
            ctx.body = { status: "PAID" };
          } else {
            const merchantOperationId = order.operationId;
            const merchantApiUrl = `${apiUrl}/acquiring/${apiVersion}/payments/${merchantOperationId}`;
            const merchantApiKey = accessToken;

            const response = await fetch(merchantApiUrl, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${merchantApiKey}`,
              },
            });

            if (response.ok) {
              const merchantResponse: any = await response.json();

              if (merchantResponse.Data.Operation[0].status === "APPROVED") {
                const updateOrderResponse = await strapi
                  .service("api::order.order")
                  .update(orderId, {
                    data: {
                      orderStatus: "PAID",
                    },
                  });

                ctx.body = { status: "PAID" };
              } else {
                ctx.body = { status: "CREATED" };
              }
            }
          }
        } else {
          ctx.internalServerError("Can't find an order with id " + orderId);
        }
        // console.log(123123123);
        // ctx.body = { status: "ok" };
      } catch (err) {
        console.error("Error in orderStatus:", err);
        ctx.internalServerError("An error occurred.");
      }
    },
  })
);
