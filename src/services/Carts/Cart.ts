import { ProductType } from "../Products/Product";

type CartProduct = ProductType & {
  amount: number;
};
type CartType = {
  [key: string]: string | number | Array<CartProduct> | undefined;
  id?: string | number | undefined;
  timestamp?: number | undefined;
  products: Array<CartProduct>;
};
class Cart {
  private id: string | number | undefined;
  private timestamp: number | undefined;
  private products: Array<CartProduct> = [];
  constructor({ id, timestamp, products }: CartType) {
    this.id = id;
    this.timestamp = timestamp;
    this.products = products;
  }
  setProducts(products: Array<CartProduct>): void {
    this.products = products;
  }
  getProducts(): Array<CartProduct> {
    return this.products;
  }
  toObject(id: boolean = true): CartType {
    const object: CartType = {
      timestamp: this.timestamp,
      products: this.products,
    };
    id === true && (object.id = this.id);
    return object;
  }
}

export { CartType, CartProduct };
export default Cart;
