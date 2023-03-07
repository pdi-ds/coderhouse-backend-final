import { CartProduct } from "../Carts/Cart";

type OrderTotalsType = {
  [key: string]: number;
  total: number;
  count: number;
};
type OrderType = {
  [key: string]: string | number | Array<CartProduct> | undefined;
  id?: string | number | undefined;
  timestamp?: number | undefined;
  user?: string | number | undefined;
  products?: Array<CartProduct>;
  total?: number | undefined;
  count?: number | undefined;
};
class Order {
  private id: string | number | undefined;
  private user: string | number | undefined;
  private timestamp: number | undefined;
  private products: Array<CartProduct> = [];
  private total: number | undefined;
  private count: number | undefined;
  constructor({ id, user, timestamp, products, total, count }: OrderType) {
    this.id = id;
    this.user = user;
    this.timestamp = timestamp;
    this.products = products || [];
    this.total = total;
    this.count = count;
  }
  toObject(id: boolean = true): OrderType {
    const object: OrderType = {
      user: this.user,
      timestamp: this.timestamp,
      products: this.products,
      total: this.total,
      count: this.count,
    };
    id === true && (object.id = this.id);
    return object;
  }
}

export { OrderType, OrderTotalsType };
export default Order;
