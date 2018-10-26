import * as Discord from "discord.js";
import { IBotCommand, IBotConfig, ILogger } from "../api";
import PingCommand from "./commands/PingCommand";

export class QuestBot {
  private cfg: IBotConfig;
  private logger: ILogger;
  private commands: IBotCommand[];

  private client?: Discord.Client;

  constructor(cfg: IBotConfig, logger: ILogger) {
    this.cfg = cfg;
    this.logger = logger;

    this.commands = [
      new PingCommand(),
    ];
  }

  public start(): void {
    this.client = new Discord.Client();

    this.client.on("ready", () => {
      if (this.cfg.game) {
          this.client!.user.setGame(this.cfg.game);
      }
      this.client!.user.setStatus("online");
      this.logger.info("Bot started");
    });

    this.client.on("message", (message) => {
      if (!message.content.startsWith(this.cfg.commandPrefix)) {
        return;
      }

      const command: IBotCommand | undefined
          = this.commands.find((cmd) => message.content.startsWith(this.cfg.commandPrefix + cmd.name));
      if (command) {
        command.execute(message);
      }
    });

    this.client.login(this.cfg.token);
  }
}
