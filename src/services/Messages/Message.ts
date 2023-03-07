import { PathLike } from "fs";

type MessageType = {
  [key: string]: string | number | PathLike | undefined;
  id?: string | number | undefined;
  email?: string | undefined;
  avatar?: PathLike | undefined;
  message?: string | undefined;
  timestamp?: number | undefined;
};
class Message {
  private id: string | number | undefined;
  private email: string | undefined;
  private avatar: PathLike | undefined;
  private message: string | undefined;
  private timestamp: number | undefined;
  constructor({ id, email, avatar, message, timestamp }: MessageType) {
    this.id = id;
    this.email = email;
    this.avatar = avatar;
    this.message = message;
    this.timestamp = timestamp;
  }
  toObject(id: boolean = true): MessageType {
    const object: MessageType = {
      email: this.email,
      avatar: this.avatar,
      message: this.message,
      timestamp: this.timestamp,
    };
    id === true && (object.id = this.id);
    return object;
  }
}

export { MessageType };
export default Message;
