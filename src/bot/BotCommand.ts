import { ChatInputCommandInteraction } from "discord.js";
import { IBotCommand, ISerializableSlashCommand } from "../api.js";

export abstract class BotCommand implements IBotCommand {
  public abstract get data(): ISerializableSlashCommand;
  public abstract execute(interaction: ChatInputCommandInteraction): Promise<void>;
}
