import * as Discord from "discord.js";
import * as ora from "ora";
import { IBotCommand, IBotConfig, ILogger } from "../api";
import PingCommand from "./commands/PingCommand";

export class QuestBot {
  private cfg: IBotConfig;
  private commands: IBotCommand[];

  private client?: Discord.Client;

  constructor(cfg: IBotConfig) {
    this.cfg = cfg;

    this.commands = [
      new PingCommand(),
    ];
  }

  public start(): void {
    const spinner = ora("Starting bot").start();

    this.client = new Discord.Client();

    this.client.on("ready", () => {
      if (this.cfg.activity) {
          this.client!.user.setActivity(this.cfg.activity);
      }
      this.client!.user.setStatus("online");
      spinner.succeed("Bot started");
    });

    this.client.on("message", (message) => {
      if (message.author.bot || !message.content.startsWith(this.cfg.commandPrefix)) {
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
