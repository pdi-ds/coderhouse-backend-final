import { Router } from "express";
import CartsControllers from "../../controllers/Carts/Carts";

const routes = Router();
routes
  .get("/:id", CartsControllers.get)
  .post("/", CartsControllers.create)
  .delete("/:id", CartsControllers.delete)
  .get("/:id/products", CartsControllers.getProducts)
  .post("/:id/products", CartsControllers.addProducts)
  .delete("/:id/products/:product_id", CartsControllers.deleteProduct);

export default routes;
