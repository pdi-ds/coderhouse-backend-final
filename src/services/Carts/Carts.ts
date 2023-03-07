import { Container } from "../../data-access/data-access";
import Products from "../Products/Products";
import Product from "../Products/Product";
import { ConnectionConfig } from "../../config/ConnectionConfig";
import Cart, { CartType, CartProduct } from "./Cart";
import { config } from "../../data-access/data-access";

class Carts extends Container {
  private readonly products: Products;
  readonly aggregationFields: object = {
    $project: {
      _id: 0,
      id: "$_id",
      timestamp: 1,
      products: 1,
    },
  };
  static instance: Carts;
  private constructor(config: ConnectionConfig) {
    super(config, "carts");
    this.products = Products.getInstance();
  }
  static getInstance() {
    typeof Carts.instance === "undefined" &&
      (Carts.instance = new Carts(config));
    return Carts.instance;
  }
  async create(): Promise<Cart | boolean> {
    const record: CartType = { timestamp: Date.now(), products: [] };
    const result = await this.insert(record);
    return result !== false ? new Cart({ id: result, ...record }) : false;
  }
  async addToCart(
    id: any,
    products: Array<CartProduct>
  ): Promise<Cart | null | boolean> {
    const record: Cart | null = await this.get(id);
    if (record === null) return null;
    let filteredProducts: Array<CartProduct> = [];
    let index = 0;
    while (index < products.length) {
      const product = await this.products
        .get(products[index].id)
        .then((result) => result);
      if (product !== null) {
        const productIndex = (record as Cart)
          .getProducts()
          .findIndex(
            ({ id }) => String(id) === String((product as Product).getId())
          );
        if (productIndex >= 0) {
          (record as Cart).getProducts()[productIndex].amount +=
            products[index].amount;
        } else {
          filteredProducts.push({
            ...product,
            amount: products[index]?.amount || 1,
          });
        }
      }
      index = index + 1;
    }
    if (filteredProducts.length > 0) {
      filteredProducts = ([] as Array<CartProduct>).concat(
        (record as Cart).getProducts(),
        filteredProducts
      );
      filteredProducts = filteredProducts.filter(
        (value, index) => filteredProducts.indexOf(value) === index
      );
    }
    record.setProducts(
      filteredProducts.length > 0
        ? filteredProducts
        : (record as Cart).getProducts()
    );
    const result = await this.update(id, record.toObject(false));
    return result !== false ? record : false;
  }
  async removeFromCart(
    id: any,
    productId: any
  ): Promise<Cart | boolean | null> {
    const record: Cart | null = await this.get(id);
    if (record === null) return null;
    const productIndex = (record as Cart)
      .getProducts()
      .findIndex(
        (product: CartProduct) => String(product.id) === String(productId)
      );
    if (productIndex >= 0) {
      (record as Cart).getProducts().splice(productIndex, 1);
      await this.update(id, record.toObject(false));
      return record;
    }
    return record as Cart;
  }
  async insert(data: Object): Promise<any | boolean> {
    return await super.insert(this.encode(data));
  }
  async update(id: string | number, data: object): Promise<boolean> {
    return await super.update(id, this.encode(data));
  }
  encode(data: object): object {
    switch (process.env.DB_ENGINE) {
      case "mysql":
      case "sqlite3":
        (data as { products: Array<Product> | string }).products =
          JSON.stringify((data as CartType).products);
        break;
    }
    return data;
  }
  decode(data: object): object {
    switch (process.env.DB_ENGINE) {
      case "mysql":
      case "sqlite3":
        if (data !== null)
          (data as { products: Array<Product> | string }).products = JSON.parse(
            (data as { products: string }).products
          );
        break;
    }
    return data;
  }
  async get(id: string | number): Promise<Cart | null> {
    return await super
      .get(id)
      .then((response: object) =>
        response ? new Cart(this.decode(response) as CartType) : null
      );
  }
  async remove(id: string | number): Promise<boolean | null> {
    const record: Cart | null = await this.get(id);
    if (record === null) return null;
    return await super.delete(id);
  }
}

export default Carts;
