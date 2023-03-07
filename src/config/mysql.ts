import { ConnectionConfig } from "./ConnectionConfig";

const options: ConnectionConfig = {
  client: "mysql",
  connection: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 4069,
    user: process.env.DB_USER || "su",
    password: process.env.DB_PASSWORD || "123",
    database: process.env.DB_NAME || "final",
  },
};

export default options;
