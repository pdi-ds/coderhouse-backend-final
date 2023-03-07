import { Request, Response } from "express";
import Carts from "../../services/Carts/Carts";
import Cart, { CartProduct } from "../../services/Carts/Cart";
import logger from "../../services/Logger/Logger";

const storage: Carts = Carts.getInstance();
class CartsControllers {
  static async get(request: Request, response: Response) {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    await storage
      .get(request.params.id)
      .then((result: Cart | null) => {
        result !== null
          ? response.json({ cart: (result as Cart).toObject() })
          : response.json({
              error: "Shopping cart not found",
            });
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
  static async create(request: Request, response: Response) {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    await storage
      .create()
      .then((result: Cart | boolean) => {
        result !== false
          ? response.json({
              message: "Cart created successfully",
              cart: (result as Cart).toObject(),
            })
          : response.json({
              error: "An error occurred while trying to enter the cart",
            });
      })
      .catch((err) => {
        logger.log(
          "error",
          `An error occurred while trying to enter the cart: ${err}`
        );
        response.json({
          error: "An error occurred while trying to enter the cart",
        });
      });
  }
  static async delete(request: Request, response: Response) {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    await storage
      .remove(request.params.id)
      .then((result: boolean | null) => {
        if (result !== false) {
          if (result === null) {
            response.json({
              error: "Shopping cart not found",
            });
          } else {
            response.json({
              message: "Shopping cart successfully removed",
            });
          }
        } else {
          response.json({
            error: "An error occurred while trying to delete the cart",
          });
        }
      })
      .catch((err) => {
        logger.log(
          "error",
          `An error occurred while trying to delete the cart: ${err}`
        );
        response.json({
          error: "An error occurred while trying to delete the cart",
        });
      });
  }
  static async getProducts(request: Request, response: Response) {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    await storage
      .get(request.params.id)
      .then((result: Cart | null) => {
        result !== null
          ? response.json({
              products: (result as Cart).getProducts(),
            })
          : response.json({
              error: "Shopping cart not found",
            });
      })
      .catch((err) => {
        logger.log(
          "error",
          `An error occurred while trying to load the cart products: ${err}`
        );
        response.json({
          error:
            "An error occurred while trying to load the products from the cart",
        });
      });
  }
  static async addProducts(request: Request, response: Response) {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    const products: Array<CartProduct> = request.body.products.map(
      (product: { id: string; amount?: string }) => ({
        id: product.id,
        amount: Number(product.amount),
      })
    );
    await storage
      .addToCart(request.params.id, products)
      .then((result: Cart | null | boolean) => {
        if (result !== false) {
          if (result === null) {
            response.json({
              error: "Shopping cart not found",
            });
          } else {
            response.json({
              message: "Products added to cart successfully",
              cart: result,
            });
          }
        } else {
          response.json({
            error: "An error occurred while trying to edit the cart",
          });
        }
      })
      .catch((err) => {
        logger.log(
          "error",
          `An error occurred while trying to add the product to the cart: ${err}`
        );
        response.json({
          error:
            "An error occurred while trying to add the product to the cart",
        });
      });
  }
  static async deleteProduct(request: Request, response: Response) {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    await storage
      .removeFromCart(request.params.id, request.params.product_id)
      .then((result: Cart | null | boolean) => {
        if (result !== false) {
          if (result === null) {
            response.json({
              error: "Shopping cart not found",
            });
          } else {
            response.json({
              message: "Product removed to cart successfully",
              cart: (result as Cart).toObject(),
            });
          }
        } else {
          response.json({
            error: "An error occurred while trying to edit the cart",
          });
        }
      })
      .catch((err) => {
        logger.log(
          "error",
          `An error occurred while trying to remove the product from the cart: ${err}`
        );
        response.json({
          error:
            "An error occurred while trying to remove the product from the cart",
        });
      });
  }
}

export default CartsControllers;
