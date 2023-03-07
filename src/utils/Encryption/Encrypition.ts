import * as bcrypt from "bcrypt";

class Encrypition {
  static compare(str1: any, str2: any): boolean {
    return bcrypt.compareSync(str1, str2);
  }
  static create(str: any): String {
    return bcrypt.hashSync(str, bcrypt.genSaltSync(10));
  }
}

export default Encrypition;
