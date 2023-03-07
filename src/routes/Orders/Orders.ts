import { Router } from "express";
import OrdersControllers from "../../controllers/Orders/Orders";
import AuthMiddlewares from "../Middlewares/Auth/Auth";

const routes = Router();
routes
  .get("/", AuthMiddlewares.isAuthenticatedRequest, OrdersControllers.getAll)
  .get("/:id", AuthMiddlewares.isAuthenticatedRequest, OrdersControllers.get)
  .post(
    "/create/:id",
    AuthMiddlewares.isAuthenticatedRequest,
    OrdersControllers.create
  );

export default routes;
