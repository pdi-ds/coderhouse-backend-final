import { Request, Response } from "express";
import Orders from "../../services/Orders/Orders";
import Order, { OrderType } from "../../services/Orders/Order";
import Validation, {
  ValidationResults,
} from "../../utils/Validation/Validation";
import logger from "../../services/Logger/Logger";
import Carts from "../../services/Carts/Carts";
import Cart from "../../services/Carts/Cart";
import User from "../../services/Users/User";
import Email from "../../services/Email/Email";

const storage: Orders = Orders.getInstance();
const carts: Carts = Carts.getInstance();
class OrdersControllers {
  static async getAll(request: Request, response: Response) {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    await storage
      .getAllBy("user", String((request.user as User).toObject().id))
      .then((orders: Array<Order>) => {
        response.send({ orders: orders.map((order) => order.toObject()) });
      })
      .catch((err) => {
        logger.log(
          "error",
          `An error occurred while trying to load the orders: ${err}`
        );
        response.json({
          error: "An error occurred while trying to load the orders",
        });
      });
  }
  static async get(request: Request, response: Response) {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    await storage
      .get(request.params.id)
      .then((result: Order | null) => {
        if (result !== null) {
          const resultObj: OrderType = result.toObject();
          if (
            String(resultObj.user) ===
            String((request.user as User).toObject().id)
          ) {
            response.json({ order: resultObj });
          } else {
            response.json({
              error: "The order does not belong to your user",
            });
          }
        } else {
          response.json({
            error: "Order not found",
          });
        }
      })
      .catch((err) => {
        logger.log(
          "error",
          `An error occurred while trying to load the order: ${err}`
        );
        response.json({
          error: "An error occurred while trying to load the order",
        });
      });
  }
  static async create(request: Request, response: Response) {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    await carts
      .get(request.params.id)
      .then(async (cart: Cart | null) => {
        if (cart !== null) {
          await storage
            .create((request.user as User).toObject().id, cart.toObject())
            .then(async (order: ValidationResults | Order | boolean) => {
              if (order !== false) {
                if (
                  Validation.isValidationResult(order as ValidationResults) ===
                    true &&
                  (order as ValidationResults).errors.length > 0
                ) {
                  response.json({
                    error: "Verifica los campos ingresados",
                    errors: (order as ValidationResults).errors,
                  });
                } else {
                  const orderObj: OrderType = (order as Order).toObject();
                  await carts.remove(request.params.id);
                  let detail: string = (orderObj.products || [])
                    .map(
                      (line) =>
                        `${line.name} (x${line.amount} - $ ${line.price})`
                    )
                    .join("<br>");
                  logger.log("info", `new order created`);
                  await Email.getInstance().send(
                    "New order generated",
                    `<p>Order entered successfully.</p><p>Order Detail:<br>${detail}</p><p>Quantity of products: ${orderObj.count}<br>Total: ${orderObj.total}</p>`
                  );
                  response.json({
                    message: "Order created successfully",
                    order: orderObj,
                  });
                }
              } else {
                response.json({
                  error: "An error occurred while trying to enter the order",
                });
              }
            })
            .catch((err) => {
              logger.log(
                "error",
                `An error occurred while trying to enter the order: ${err}`
              );
              response.json({
                error: "An error occurred while trying to enter the order",
              });
            });
        } else {
          response.json({
            error: "Shopping cart not found",
          });
        }
      })
      .catch((err) => {
        logger.log(
          "error",
          `An error occurred while trying to load the cart: ${err}`
        );
        response.json({
          error: "An error occurred while trying to load the cart",
        });
      });
  }
}

export default OrdersControllers;
