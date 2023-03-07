import { PathLike } from "fs";

type Connection = {
  [key: string]: number | String | PathLike | undefined;
  filename?: PathLike | undefined;
  host?: string | undefined;
  port?: number | String | undefined;
  user?: string | undefined;
  password?: string | undefined;
  database?: string | undefined;
};
type ConnectionConfig = {
  [key: string]: number | String | boolean | Connection | undefined;
  uri?: string | undefined;
  database?: string | undefined;
  client?: string | undefined;
  connection?: Connection | undefined;
  useNullAsDefault?: boolean | undefined;
};

export { Connection, ConnectionConfig };
