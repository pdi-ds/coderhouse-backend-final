type CLIArgs = {
  [x: string]: unknown;
  port: number;
  mode: string;
  cpus: number;
  gzip: boolean;
  _: (string | number)[];
  $0: string;
};

export { CLIArgs };
