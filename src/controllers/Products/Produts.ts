import { Request, Response } from "express";
import Products from "../../services/Products/Products";
import Product from "../../services/Products/Product";
import Validation, {
  ValidationResults,
} from "../../utils/Validation/Validation";
import logger from "../../services/Logger/Logger";

const storage: Products = Products.getInstance();
class ProductsControllers {
  static async getAll(request: Request, response: Response) {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    await storage
      .getAll()
      .then((products: Array<Product>) => {
        response.send({
          products: products.map((product) => product.toObject()),
        });
      })
      .catch((err) => {
        logger.log(
          "error",
          `An error occurred while trying to load the products: ${err}`
        );
        response.json({
          error: "An error occurred while trying to load the products",
        });
      });
  }
  static async get(request: Request, response: Response) {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    await storage
      .get(request.params.id)
      .then((result: Product | null) => {
        result !== null
          ? response.json({ product: result.toObject() })
          : response.json({
              error: "product not found",
            });
      })
      .catch((err) => {
        logger.log(
          "error",
          `An error occurred while trying to load the product: ${err}`
        );
        response.json({
          error: "An error occurred while trying to load the product",
        });
      });
  }
  static async create(request: Request, response: Response) {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    await storage
      .create({
        name: request.body.name,
        price: Number(request.body.price),
        thumbnail: request.body.thumbnail,
      })
      .then((result: ValidationResults | Product | boolean) => {
        if (result !== false) {
          Validation.isValidationResult(result as ValidationResults) === true &&
          (result as ValidationResults).errors.length > 0
            ? response.json({
                error: "Check the entered fields",
                errors: (result as ValidationResults).errors,
              })
            : response.json({
                message: "Product created successfully",
                product: (result as Product).toObject(),
              });
        } else {
          response.json({
            error: "An error occurred while trying to enter the product",
          });
        }
      })
      .catch((err) => {
        logger.log(
          "error",
          `An error occurred while trying to enter the product: ${err}`
        );
        response.json({
          error: "An error occurred while trying to enter the product",
        });
      });
  }
  static async update(request: Request, response: Response) {
    response.setHeader("Content-Type", "application/json; charset=UTF-8");
    await storage
      .edit(request.params.id, {
        name: request.body?.name || undefined,
        price: request.body?.price ? Number(request.body.price) : undefined,
        thumbnail: request.body?.thumbnail || undefined,
      })
      .then((result: Product | ValidationResults | boolean | null) => {
        if (result !== false) {
          if (result === null) {
            response.json({
              error: "Product not found",
            });
          } else {
            Validation.isValidationResult(result as ValidationResults) ===
              true && (result as ValidationResults).errors.length > 0
              ? response.json({
                  error: "Check the entered fields",
                  errors: (result as ValidationResults).errors,
                })
              : response.json({
                  message: "Successfully edited product",
                  product: (result as Product).toObject(),
                });
          }
        } else {
          response.json({
            error: "An error occurred while trying to edit the product",
          });
        }
      })
      .catch((err) => {
        logger.log(
          "error",
          `An error occurred while trying to edit the product: ${err}`
        );
        response.json({
          error: "An error occurred while trying to edit the product",
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
              error: "Product not found",
            });
          } else {
            response.json({
              message: "Product successfully removed",
            });
          }
        } else {
          response.json({
            error: "An error occurred while trying to delete the product",
          });
        }
      })
      .catch((err) => {
        logger.log(
          "error",
          `An error occurred while trying to delete the product: ${err}`
        );
        response.json({
          error: "An error occurred while trying to delete the product",
        });
      });
  }
}

export default ProductsControllers;
