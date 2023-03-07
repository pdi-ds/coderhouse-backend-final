import { PathLike } from "fs";

type ProductType = {
  [key: string]: number | String | PathLike | undefined;
  id?: number | String | undefined;
  name?: String | undefined;
  price?: number | undefined;
  thumbnail?: PathLike | undefined;
};
class Product {
  private id: String | number | undefined;
  private name: String | undefined;
  private price: number | undefined;
  private thumbnail: PathLike | undefined;
  constructor({ id, name, price, thumbnail }: ProductType) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.thumbnail = thumbnail;
  }
  getId(): String | number | undefined {
    return this.id;
  }
  toObject(id: boolean = true): ProductType {
    const object: ProductType = {
      name: this.name,
      price: this.price,
      thumbnail: this.thumbnail,
    };
    id === true && (object.id = this.id);
    return object;
  }
}

export { ProductType };
export default Product;
