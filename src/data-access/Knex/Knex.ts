import knex, { Knex as KnexNamespace } from "knex";
import CreateTableBuilder = KnexNamespace.CreateTableBuilder;
import { ConnectionConfig } from "../../config/ConnectionConfig";

class Knex {
  readonly tableName: string;
  readonly connection;
  constructor(config: ConnectionConfig | object, tableName: string) {
    this.tableName = tableName;
    this.connection = knex(<object>config);
  }
  async insert(data: Object): Promise<any | boolean> {
    return await this.connection(this.tableName)
      .insert(data, "id")
      .then((id) => id[0])
      .catch((err) => {
        return false;
      });
  }
  async update(id: any, data: object): Promise<boolean> {
    return await this.connection(this.tableName)
      .where({ id })
      .update(data)
      .then(() => true)
      .catch((err) => {
        return false;
      });
  }
  async delete(id: any): Promise<boolean> {
    return await this.connection(this.tableName)
      .where({ id })
      .delete()
      .then(() => true)
      .catch((err) => {
        return false;
      });
  }
  async get(id: any): Promise<object | null> {
    const result = await this.connection
      .from(this.tableName)
      .where({ id })
      .limit(1)
      .then((records) => records)
      .catch((err) => {
        return null;
      });
    return result !== null && result.length > 0 ? result[0] : null;
  }
  async getBy(field: string, value: any): Promise<object | null> {
    const result = await this.connection
      .from(this.tableName)
      .where({ [field]: value })
      .limit(1)
      .then((records) => records)
      .catch((err) => {
        return null;
      });
    return result !== null && result.length > 0 ? result[0] : null;
  }
  async getAllBy(field: string, value: any): Promise<object | null> {
    const result = await this.connection
      .from(this.tableName)
      .where({ [field]: value })
      .then((records) => records)
      .catch((err) => {
        return null;
      });
    return result !== null && result.length > 0 ? result : null;
  }
  async getAll(): Promise<Array<object> | boolean> {
    return await this.connection
      .from(this.tableName)
      .select("*")
      .then((records: Array<any>) => records)
      .catch((err) => {
        return false;
      });
  }
}

export default Knex;
