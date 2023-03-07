import { Container } from "../../data-access/data-access";
import { ConnectionConfig } from "../../config/ConnectionConfig";
import Message, { MessageType } from "./Message";
import { config } from "../../data-access/data-access";
import Validation, {
  ValidationResults,
} from "../../utils/Validation/Validation";

class Messages extends Container {
  readonly aggregationFields: object = {
    $project: {
      _id: 0,
      id: "$_id",
      email: 1,
      avatar: 1,
      message: 1,
      timestamp: 1,
    },
  };
  static instance: Messages;
  private constructor(config: ConnectionConfig) {
    super(config, "messages");
  }
  static getInstance() {
    typeof Messages.instance === "undefined" &&
      (Messages.instance = new Messages(config));
    return Messages.instance;
  }
  async create(
    message: MessageType
  ): Promise<ValidationResults | Message | boolean> {
    const validation: ValidationResults = this.validateProduct(message);
    if (validation.errors.length > 0) return validation;
    message.timestamp = Date.now();
    const result = await this.insert(message);
    return result !== false ? new Message({ id: result, ...message }) : false;
  }
  async getAll(): Promise<Array<Message>> {
    return await super
      .getAll()
      .then((result: Array<MessageType>) =>
        result ? result.map((message: MessageType) => new Message(message)) : []
      );
  }
  validateProduct(data: MessageType): ValidationResults {
    return Validation.validate(data, [
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
        field: "avatar",
        validator: (value: any): boolean => {
          return !!/^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/.test(
            value
          );
        },
        message: "The <avatar> field is required and must be of type url",
      },
      {
        field: "message",
        validator: (value: any): boolean => {
          return value !== null && value !== "";
        },
        message: "The <message> field is required",
      },
    ]);
  }
}

export default Messages;
