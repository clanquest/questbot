import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export interface IBotConfig {
  commandPrefix: string;
  token: string;
  clientId: string;
  owner?: string | string[] | Set<string>;
  activity?: string;
  listenChannel?: string;
  db?: string;
  dbUser?: string;
  dbPassword?: string;
}

export interface IBotCommand {
  data: SlashCommandBuilder;
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
}

export interface ILoggerMethod {
  (msg: string, ...args: any[]): void;
  (obj: object, msg?: string, ...args: any[]): void;
}

export interface ILogger {
  debug: ILoggerMethod;
  info: ILoggerMethod;
  warn: ILoggerMethod;
  error: ILoggerMethod;
}
