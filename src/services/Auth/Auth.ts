import { sign } from "jsonwebtoken";

class Auth {
  private static DEFAULT_JWT_SECRET: string =
    "Y0Rh7RfS8nWqxPH6WvmGAH54mED0u78X";
  static generateToken(data: object): string {
    return sign(
      data,
      String(process.env.JWT_SECRET || Auth.DEFAULT_JWT_SECRET)
    );
  }
}

export default Auth;
