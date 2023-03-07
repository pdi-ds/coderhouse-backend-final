import { config, Container } from "../../data-access/data-access";
import { ConnectionConfig } from "../../config/ConnectionConfig";
import User, { UserType } from "./User";
import Validation, {
  ValidationResult,
  ValidationResults,
} from "../../utils/Validation/Validation";

class Users extends Container {
  readonly aggregationFields: object = {
    $project: {
      _id: 0,
      id: "$_id",
      name: 1,
      email: 1,
      password: 1,
    },
  };
  static instance: Users;
  private constructor(config: ConnectionConfig) {
    super(config, "users");
  }
  static getInstance() {
    typeof Users.instance === "undefined" &&
      (Users.instance = new Users(config));
    return Users.instance;
  }
  async create(user: UserType): Promise<ValidationResults | User | boolean> {
    const validation: ValidationResults = this.validateProduct(user);
    if (validation.errors.length > 0) return validation;
    const result = await this.insert(user);
    return result !== false ? new User({ id: result, ...user }) : false;
  }
  async edit(
    id: any,
    user: UserType
  ): Promise<User | ValidationResults | boolean | null> {
    const record: User | null = await this.get(id);
    if (record === null) return null;
    const validation: ValidationResults = this.validateProduct(user);
    if (validation.valid.length === 0) return validation;
    const update: UserType = {};
    validation.valid.map((valid: ValidationResult) => {
      update[String(valid.field)] = user[String(valid.field)];
    });
    const result = await super.update(id, { ...update });
    return result === true
      ? new User({ id, ...record.toObject(false, true), ...update })
      : false;
  }
  async remove(id: any): Promise<boolean | null> {
    const record: User | null = await this.get(id);
    if (record === null) return null;
    return await super.delete(id);
  }
  async get(id: String | number | undefined): Promise<User | null> {
    return await super
      .get(id)
      .then((response: object) =>
        response ? new User(response as UserType) : null
      );
  }
  async getBy(field: String, value: any): Promise<User | null> {
    return await super
      .getBy(field, value)
      .then((response: object) =>
        response ? new User(response as UserType) : null
      );
  }
  validateProduct(data: UserType): ValidationResults {
    return Validation.validate(data, [
      {
        field: "name",
        validator: (value: any): boolean => {
          return value !== null && value !== "";
        },
        message: "The <name> field is required",
      },
      {
        field: "email",
        validator: (value: any): boolean => {
          return /^(([^<>()[\]\.,;:\s@"]+(\.[^<>()[\]\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            value
          );
        },
        message: "The <email> field is required and must be of type email",
      },
      {
        field: "password",
        validator: (value: any): boolean => {
          return value !== null && value !== "";
        },
        message: "The <password> field is required",
      },
    ]);
  }
}

export default Users;
