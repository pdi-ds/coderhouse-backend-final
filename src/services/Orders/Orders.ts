import { config, Container } from "../../data-access/data-access";
import { ConnectionConfig } from "../../config/ConnectionConfig";
import { CartProduct, CartType } from "../Carts/Cart";
import Validation, {
  ValidationResults,
} from "../../utils/Validation/Validation";
import Order, { OrderType, OrderTotalsType } from "./Order";
import Product, { ProductType } from "../Products/Product";

class Orders extends Container {
  readonly aggregationFields: object = {
    $project: {
      _id: 0,
      id: "$_id",
      user: 1,
      products: 1,
      total: 1,
      count: 1,
      timestamp: 1,
    },
  };
  static instance: Orders;
  private constructor(config: ConnectionConfig) {
    super(config, "orders");
  }
  static getInstance() {
    typeof Orders.instance === "undefined" &&
      (Orders.instance = new Orders(config));
    return Orders.instance;
  }
  async create(
    user: number | String | undefined,
    cart: CartType
  ): Promise<ValidationResults | Order | boolean> {
    const validation: ValidationResults = this.validateCart(cart);
    if (validation.errors.length > 0) return validation;
    const record: OrderType = {
      user: String(user),
      timestamp: Date.now(),
      products: cart.products,
      ...this.getCartTotals(cart),
    };
    const result = await this.insert(record);
    return result !== false ? new Order({ id: result, ...record }) : false;
  }
  async get(id: String | number | undefined): Promise<Order | null> {
    return await super
      .get(id)
      .then((response: object) =>
        response ? new Order(response as OrderType) : null
      );
  }
  async getAllBy(field: String, value: any): Promise<Array<Order>> {
    return await super
      .getAllBy(field, value)
      .then((result: Array<OrderType>) =>
        result ? result.map((order: OrderType) => new Order(order)) : []
      );
  }
  getCartTotals(cart: CartType): OrderTotalsType {
    return cart.products.reduce(
      (previous: OrderTotalsType, current: CartProduct) => {
        return {
          total:
            previous.total +
            (current?.price ? current.amount * current.price : 0),
          count: previous.count + current.amount,
        } as OrderTotalsType;
      },
      { total: 0, count: 0 } as OrderTotalsType
    );
  }
  validateCart(data: CartType): ValidationResults {
    return Validation.validate(data, [
      {
        field: "products",
        validator: (value: any): boolean => {
          return value.length > 0;
        },
        message: "The cart must contain at least one product",
      },
    ]);
  }
}

export default Orders;
