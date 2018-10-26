import * as Discord from "discord.js";
import { IBotCommand } from "../../api";

export default class PingCommand implements IBotCommand {
  public name: string = "ping";
  public helpText?: string = "Sends pong";

  public execute(message: Discord.Message): void {
    message.reply("pong!");
  }
}
