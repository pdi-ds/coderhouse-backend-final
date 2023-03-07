import { CLIArgs } from "./yargs";

type MongoStoreType = "MONGO_STORE";
type FileStoreType = "FILE_STORE";
type SessionType = MongoStoreType | FileStoreType;
type SessionOptions = {
  [key: string]: number | string | SessionType | undefined;
  type?: SessionType;
  secret?: string | undefined;
  ttl?: number | undefined;
  path?: string | undefined;
  cookieMaxAge?: number | undefined;
};
type ServerOptions = {
  [key: string]:
    | number
    | string
    | boolean
    | CLIArgs
    | SessionOptions
    | undefined;
  port: number | string;
  gzip?: boolean | undefined;
  argv?: CLIArgs | undefined;
  public?: string | undefined;
  views?: string | undefined;
  session?: SessionOptions | undefined;
};

export {
  ServerOptions,
  SessionOptions,
  SessionType,
  MongoStoreType,
  FileStoreType,
};
