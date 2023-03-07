import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import { ConnectionConfig } from "../../config/ConnectionConfig";

class Mongo {
  readonly collectionName: string;
  readonly collection: Collection;
  readonly aggregationFields: object = {};
  constructor(config: ConnectionConfig, collectionName: string) {
    this.collectionName = collectionName;
    const client: MongoClient = new MongoClient(<string>config.uri);
    const database: Db = client.db(<string>config.database);
    this.collection = database.collection(<string>this.collectionName);
  }
  async insert(data: Object): Promise<any | boolean> {
    const result = await this.collection
      .insertOne(data)
      .then(({ insertedId }) => insertedId)
      .catch((err) => {
        return false;
      });
    delete (data as { _id: any })._id;
    return result;
  }
  async update(id: any, data: object): Promise<boolean> {
    return await this.collection
      .updateOne({ _id: new ObjectId(id) }, { $set: data })
      .then(() => true)
      .catch((err) => {
        return false;
      });
  }
  async delete(id: any): Promise<boolean> {
    return await this.collection
      .deleteOne({ _id: new ObjectId(id) })
      .then(() => true)
      .catch((err) => {
        return false;
      });
  }
  async get(id: any): Promise<object | null> {
    const result = await this.collection
      .aggregate([
        this.aggregationFields,
        {
          $match: {
            id: new ObjectId(id),
          },
        },
        {
          $limit: 1,
        },
      ])
      .toArray()
      .catch((err) => {
        return null;
      });
    return result !== null && result.length > 0 ? result[0] : null;
  }
  async getBy(field: any, value: any): Promise<object | null> {
    const result = await this.collection
      .aggregate([
        this.aggregationFields,
        {
          $match: {
            [field]: value,
          },
        },
        {
          $limit: 1,
        },
      ])
      .toArray()
      .catch((err) => {
        return null;
      });
    return result !== null && result.length > 0 ? result[0] : null;
  }
  async getAllBy(field: any, value: any): Promise<object | null> {
    const result = await this.collection
      .aggregate([
        this.aggregationFields,
        {
          $match: {
            [field]: value,
          },
        },
      ])
      .toArray()
      .catch((err) => {
        return null;
      });
    return result !== null && result.length > 0 ? result : null;
  }
  async getAll(): Promise<Array<object>> {
    return await this.collection.aggregate([this.aggregationFields]).toArray();
  }
}

export default Mongo;
