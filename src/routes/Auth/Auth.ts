import { NextFunction, Request, response, Response, Router } from "express";
import passport = require("passport");
import { Strategy } from "passport-local";
import Users from "../../services/Users/Users";
import Encrypition from "../../utils/Encryption/Encrypition";
import logger from "../../services/Logger/Logger";
import AuthControllers from "../../controllers/Auth/Auth";
import AuthMiddlewares from "../Middlewares/Auth/Auth";
import User from "../../services/Users/User";
import Validation, {
  ValidationResults,
} from "../../utils/Validation/Validation";
import Email from "../../services/Email/Email";

const storage = Users.getInstance();
passport.use(
  "login",
  new Strategy(
    {
      usernameField: "email",
    },
    async (email: string, password: string, done) => {
      await storage.getBy("email", email).then((result) => {
        if (
          result === null ||
          Encrypition.compare(
            password,
            result.toObject(false, true).password
          ) === false
        ) {
          logger.log("warn", `Failed user login attempt (email: ${email}`);
          done(null, false);
        } else {
          logger.log("info", `Successful user login (email: ${email}`);
          done(null, result.toObject(true).id);
        }
      });
    }
  )
);
passport.use(
  "signup",
  new Strategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    async (request: Request, email: string, password: string, done) => {
      await storage.getBy("email", email).then(async (result) => {
        if (result !== null) done(null, false);
        else {
          const name: string = request.body.name;
          await storage
            .create({ name, email, password: Encrypition.create(password) })
            .then(async (result: User | ValidationResults | boolean) => {
              if (result !== false) {
                const isValidationError: boolean =
                  Validation.isValidationResult(result as ValidationResults) ===
                    true && (result as ValidationResults).errors.length > 0;
                if (isValidationError === false) {
                  logger.log(
                    "info",
                    `Successfully registered user (email: ${email})`
                  );
                  await Email.getInstance().send(
                    "Registered user",
                    `<p>Registered user successfully</p><p><strong>Name:</strong> ${name}<br><strong>E-mail:</strong> ${email}.</p>`
                  );
                }
                done(null, isValidationError === true ? false : result);
              } else done(null, false);
            });
        }
      });
    }
  )
);
passport.serializeUser((id, done) => done(null, id));
passport.deserializeUser(
  async (id, done) =>
    await storage.get(id as any).then((result) => done(null, result))
);
const routes = Router();
const successRedirect: string = "/user-profile";
routes
  .get("/login", AuthControllers.login)
  .post(
    "/login",
    passport.authenticate("login", {
      failureRedirect: "/login?error",
      successRedirect,
    })
  )
  .get(
    "/signup",
    AuthMiddlewares.isAuthenticated(
      (request: Request, response: Response, next: NextFunction) => {
        return response.redirect(successRedirect);
      },
      (request: Request, response: Response, next: NextFunction) => {
        next();
      }
    ),
    AuthControllers.signup
  )
  .post(
    "/signup",
    passport.authenticate("signup", {
      failureRedirect: "/signup?error",
      successRedirect,
    })
  )
  .get("/logout", AuthControllers.logout)
  .get(
    successRedirect,
    AuthMiddlewares.isAuthenticated(
      AuthControllers.userProfile,
      (request: Request, response: Response, next: NextFunction) => {
        return response.redirect("/login");
      }
    )
  )
  .post("/api/auth", AuthControllers.auth);

export default routes;
export { passport };
