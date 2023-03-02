import { ChatInputCommandInteraction, SharedNameAndDescription, SlashCommandBuilder } from "discord.js";

export interface IBotConfig {
  clientId: string;
  token: string;
  activity?: string;
  listenChannel?: string;
  db?: string;
  dbUser?: string;
  dbPassword?: string;
}

export interface IBotCommand {
  readonly data: ISerializableSlashCommand;
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
}

export interface ISerializableSlashCommand extends SharedNameAndDescription, Pick<SlashCommandBuilder, "toJSON"> {}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ILoggerMethod {
  (msg: string, ...args: any[]): void;
  (obj: object, msg?: string, ...args: any[]): void;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export interface ILogger {
  debug: ILoggerMethod;
  info: ILoggerMethod;
  warn: ILoggerMethod;
  error: ILoggerMethod;
}
