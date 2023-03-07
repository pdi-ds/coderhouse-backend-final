import { ConnectionConfig } from "./ConnectionConfig";

const options: ConnectionConfig = {
  uri: process.env.DB_URI || "mongodb://localhost:27017/",
  database: process.env.DB_NAME || "ecommerce",
};

export default options;
