import * as Discord from "discord.js";
import { IBotConfig, ILogger } from "../api";

export class QuestBot {
  private cfg: IBotConfig;
  private logger: ILogger;

  private client?: Discord.Client;

  constructor(cfg: IBotConfig, logger: ILogger) {
    this.cfg = cfg;
    this.logger = logger;
  }

  public start(): void {
    this.client = new Discord.Client();

    this.client.on("ready", () => {
      if (this.cfg.game) {
          this.client!.user.setGame(this.cfg.game);
      }
      this.client!.user.setStatus("online");
      this.logger.info("started...");
    });

    this.client.login(this.cfg.token);
  }
}
