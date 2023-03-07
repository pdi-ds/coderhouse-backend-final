type UserType = {
  [key: string]: number | String | undefined;
  id?: number | String | undefined;
  name?: String | undefined;
  email?: String | undefined;
  password?: String | undefined;
};
class User {
  private id: String | number | undefined;
  private name: String | undefined;
  private email: String | undefined;
  private password: String | undefined;
  constructor({ id, name, email, password }: UserType) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }
  getId(): String | number | undefined {
    return this.id;
  }
  toObject(id: boolean = true, password: boolean = false): UserType {
    const object: UserType = {
      name: this.name,
      email: this.email,
    };
    id === true && (object.id = this.id);
    password === true && (object.password = this.password);
    return object;
  }
}

export { UserType };
export default User;
