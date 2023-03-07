import { Request, Response, Router } from "express";
import MessagingControllers from "../../controllers/Messaging/Messaging";

const routes = Router();
routes.get("/", (request: Request, response: Response) => {
  response.setHeader("Content-Type", "text/html; charset=UTF-8");
  response.render("messaging");
});

export default routes;
