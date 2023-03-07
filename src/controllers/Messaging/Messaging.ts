import Messages from "../../services/Messages/Messages";
import Message from "../../services/Messages/Message";
import logger from "../../services/Logger/Logger";

const storage: Messages = Messages.getInstance();
class MessagingControllers {
  static async getAll() {
    return await storage
      .getAll()
      .then((messages: Array<Message>) => {
        return { messages: messages.map((message) => message.toObject()) };
      })
      .catch((err) => {
        logger.log(
          "error",
          `An error occurred while trying to load the messages: ${err}`
        );
        return { error: "An error occurred while trying to load the messages" };
      });
  }
}

export default MessagingControllers;
