import { Request, Response } from "express";
import Users from "../../services/Users/Users";
import User from "../../services/Users/User";
import { sign } from "jsonwebtoken";
import Encrypition from "../../utils/Encryption/Encrypition";
import logger from "../../services/Logger/Logger";
import Auth from "../../services/Auth/Auth";

const storage: Users = Users.getInstance();
class AuthControllers {
  static login(request: Request, response: Response) {
    response.render("login", {
      error: request.query.hasOwnProperty("error") ? true : false,
    });
  }
  static signup(request: Request, response: Response) {
    response.render("signup", {
      error: request.query.hasOwnProperty("error") ? true : false,
    });
  }
  static logout(request: Request, response: Response) {
    request.logout((err) => {});
    response.redirect("/login");
  }
  static userProfile(request: Request, response: Response) {
    const token = Auth.generateToken({
      id: (request.user as User).toObject().id,
    });
    return response.render("user-profile", { token, ...request.user });
  }
  static notAuthhorized(request: Request, response: Response) {
    response
      .setHeader("Content-Type", "application/json; charset=UTF-8")
      .status(401)
      .json({
        errorCode: -1,
        error: `Credenciales incorrectas`,
      });
  }
  static async auth(request: Request, response: Response) {
    const email: string | undefined = request.body?.email;
    const password: string | undefined = request.body?.password;
    if (email && password) {
      await storage
        .getBy("email", email)
        .then((result) => {
          if (
            result === null ||
            Encrypition.compare(
              String(password),
              result.toObject(false, true).password
            ) === false
          ) {
            logger.log(
              "warn",
              `User authorization attempt by API failed (email: ${email}`
            );
            AuthControllers.notAuthhorized(request, response);
          } else {
            logger.log(
              "info",
              `Successful API user authorization (email: ${email}`
            );
            const token = Auth.generateToken({ id: result.toObject().id });
            request.user = result;
            response
              .setHeader("Content-Type", "application/json; charset=UTF-8")
              .status(200)
              .json({ token });
          }
        })
        .catch((err) => {
          logger.log(
            "error",
            `An error occurred while trying to load the user: ${err}`
          );
          response.json({
            error: "An error occurred while trying to load the user",
          });
        });
    } else AuthControllers.notAuthhorized(request, response);
  }
}
export default AuthControllers;
