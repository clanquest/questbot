import * as Discord from "discord.js";

export interface IBotConfig {
  commandPrefix: string;
  token: string;
  owner?: string | string[] | Set<string>;
  activity?: string;
}

export interface IBotCommand {
  name: string;
  helpText?: string;
  execute(message: Discord.Message): void;
}

export interface IWebhookConfig {
  id: string;
  token: string;
  message: Discord.StringResolvable;
  messageOptions?: Discord.MessageAdditions;
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
