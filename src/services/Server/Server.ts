import express = require("express");
import http = require("http");
import { Express, Request, Response } from "express";
import { engine } from "express-handlebars";
import { Server as HttpServer } from "http";
import { Server as IOServer, Socket } from "socket.io";
import { AddressInfo } from "net";
import products from "../../routes/Products/Products";
import carts from "../../routes/Carts/Carts";
import messaging from "../../routes/Messaging/Messaging";
import auth from "../../routes/Auth/Auth";
import orders from "../../routes/Orders/Orders";
import MessagingControllers from "../../controllers/Messaging/Messaging";
import compression = require("compression");
import logger from "../Logger/Logger";
import * as os from "os";
import { ServerOptions, SessionType } from "../../../types/Server";
import Messages from "../Messages/Messages";
import session = require("express-session");
import SessionFileStore = require("session-file-store");
import MongoStore = require("connect-mongo");
import passport = require("passport");

class Server {
  static readonly DEFAULT_PORT: number = 8080;
  static readonly DEFAULT_STATIC_PATH: string = `${process.cwd()}/public`;
  static readonly DEFAULT_VIEWS_PATH: string = `${process.cwd()}/views`;
  static readonly DEFAULT_SESSION_TYPE: SessionType = "FILE_STORE";
  static readonly DEFAULT_SESSION_SECRET_KEY: string =
    "3utc64ueKwXyuNyvEUmKh7uq";
  static readonly DEFAULT_SESSION_TTL: number = 60 * 60 * 24 * 7;
  static readonly DEFAULT_SESSION_STORAGE_PATH: string = `${process.cwd()}/session-storage`;
  static readonly DEFAULT_SESSION_COOKIE_MAXAGE: number = 60 * 60 * 24;
  static readonly DEFAULT_SESSION_MONGO_URL: string =
    "mongodb://localhost:27017/ecommerce";
  private readonly port: number;
  private readonly app: Express;
  private readonly server: HttpServer;
  private readonly io: IOServer;
  private readonly messages: Messages;
  constructor(options?: ServerOptions) {
    logger.log("info", "initializing server");
    this.port = Number(options?.port || Server.DEFAULT_PORT);
    this.messages = Messages.getInstance();
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new IOServer(this.server);
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(express.static(options?.public || Server.DEFAULT_STATIC_PATH));
    this.app.engine("handlebars", engine({ defaultLayout: "main" }));
    this.app.set("view engine", "handlebars");
    this.app.set("views", options?.views || Server.DEFAULT_VIEWS_PATH);
    logger.log(
      "info",
      `Using session in ${
        options?.session?.type === "MONGO_STORE" ||
        Server.DEFAULT_SESSION_TYPE === "MONGO_STORE"
          ? "Mongo"
          : "file system"
      }`
    );
    const sessionOptions: Object =
      options?.session?.type === "MONGO_STORE" ||
      Server.DEFAULT_SESSION_TYPE === "MONGO_STORE"
        ? {
            store: MongoStore.create({
              mongoUrl:
                String(options?.session?.mongoUrl) ||
                Server.DEFAULT_SESSION_MONGO_URL,
            }),
          }
        : {
            store: new (SessionFileStore(session))({
              path:
                options?.session?.path || Server.DEFAULT_SESSION_STORAGE_PATH,
              ttl: options?.session?.ttl || Server.DEFAULT_SESSION_TTL,
              retries: 0,
            }),
          };
    this.app.use(
      session({
        rolling: true,
        resave: true,
        saveUninitialized: false,
        secret: options?.session?.secret || Server.DEFAULT_SESSION_SECRET_KEY,
        cookie: {
          maxAge:
            options?.session?.cookieMaxAge ||
            Server.DEFAULT_SESSION_COOKIE_MAXAGE,
          secure: false,
          httpOnly: false,
        },
        ...sessionOptions,
      })
    );
    if (options?.gzip === true) {
      logger.log("info", "Using gzip compression");
      this.app.use(compression());
    }
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.app.use("/api/products", products);
    this.app.use("/api/carts", carts);
    this.app.use("/api/orders", orders);
    this.app.use("/chat", messaging);
    this.app.use(auth);
    this.app
      .get("/?", (request: Request, response: Response) => {
        response.render("index");
      })
      .get("/info", (request: Request, response: Response) => {
        response.render("info", {
          platform: process.platform,
          argv: JSON.stringify(options?.argv || {}),
          execPath: process.execPath,
          pid: process.pid,
          memory: process.memoryUsage.rss(),
          version: process.version,
          cpus: os.cpus().length,
        });
      })
      .all("/api(/:called)?", (request: Request, response: Response) => {
        logger.log("warn", `API path not implemented: ${request.originalUrl}`);
        response.status(404);
        response.json({
          errorCode: -2,
          error: `${request.method}:${request.baseUrl}${request.url} not implemented`,
        });
      })
      .all("*", (request: Request, response: Response) => {
        logger.log("warn", `Path not found: ${request.originalUrl}`);
        response.status(404).render("error-404");
      });
  }
  getApp(): Express {
    return this.app;
  }
  start(): void {
    this.server.listen(this.port, () => {
      const { port } = this.server.address() as AddressInfo;
      logger.log(
        "info",
        `Process running in port ${port} (PID: ${process.pid})`
      );
    });
    this.io.on("connection", async (socket: Socket) => {
      logger.log("info", `Connected client (ID: ${socket.id})`);
      const result = await MessagingControllers.getAll();
      socket.emit("messages", result);
      socket.on("message", async ({ email, avatar, message }) => {
        await this.messages.create({ email, avatar, message });
        this.messages
          .getAll()
          .then((result) =>
            this.io.sockets.emit("messages", { messages: result })
          );
      });
    });
    this.server.on("error", (err: string) => {
      logger.log("error", `An error occurred ${err}.`);
    });
  }
}

export default Server;
