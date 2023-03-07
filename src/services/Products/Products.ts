import { config, Container } from "../../data-access/data-access";
import { ConnectionConfig } from "../../config/ConnectionConfig";
import Product, { ProductType } from "./Product";
import Validation, {
  ValidationResult,
  ValidationResults,
} from "../../utils/Validation/Validation";

class Products extends Container {
  readonly aggregationFields: object = {
    $project: {
      _id: 0,
      id: "$_id",
      name: 1,
      price: 1,
      thumbnail: 1,
    },
  };
  static instance: Products;
  private constructor(config: ConnectionConfig) {
    super(config, "products");
  }
  static getInstance() {
    typeof Products.instance === "undefined" &&
      (Products.instance = new Products(config));
    return Products.instance;
  }
  async create(
    product: ProductType
  ): Promise<ValidationResults | Product | boolean> {
    const validation: ValidationResults = this.validateProduct(product);
    if (validation.errors.length > 0) return validation;
    const result = await this.insert(product);
    return result !== false ? new Product({ id: result, ...product }) : false;
  }
  async edit(
    id: any,
    product: ProductType
  ): Promise<Product | ValidationResults | boolean | null> {
    const record: Product | null = await this.get(id);
    if (record === null) return null;
    const validation: ValidationResults = this.validateProduct(product);
    if (validation.valid.length === 0) return validation;
    const update: ProductType = {};
    validation.valid.map((valid: ValidationResult) => {
      update[String(valid.field)] = product[String(valid.field)];
    });
    const result = await super.update(id, { ...update });
    return result === true
      ? new Product({ id, ...record.toObject(), ...update })
      : false;
  }
  async remove(id: any): Promise<boolean | null> {
    const record: Product | null = await this.get(id);
    if (record === null) return null;
    return await super.delete(id);
  }
  async get(id: String | number | undefined): Promise<Product | null> {
    return await super
      .get(id)
      .then((response: object) =>
        response ? new Product(response as ProductType) : null
      );
  }
  async getAll(): Promise<Array<Product>> {
    return await super
      .getAll()
      .then((result: Array<ProductType>) =>
        result ? result.map((product: ProductType) => new Product(product)) : []
      );
  }
  validateProduct(data: ProductType): ValidationResults {
    return Validation.validate(data, [
      {
        field: "name",
        validator: (value: any): boolean => {
          return value !== null && value !== "";
        },
        message: "The <name> field is required",
      },
      {
        field: "price",
        validator: (value: any): boolean => {
          return !isNaN(parseInt(value)) && Number(value) >= 0;
        },
        message: "The <price> field is required and must be a numeric value",
      },
      {
        field: "thumbnail",
        validator: (value: any): boolean => {
          return /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i.test(
            value
          );
        },
        message: "The <thumbnail> field is required and must be of type url",
      },
    ]);
  }
}

export default Products;
