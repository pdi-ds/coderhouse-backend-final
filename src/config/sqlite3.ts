import { ConnectionConfig } from "./ConnectionConfig";

const options: ConnectionConfig = {
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: "./data/db.sqlite",
  },
};

export default options;
