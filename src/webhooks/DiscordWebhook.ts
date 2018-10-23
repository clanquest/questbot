import * as Discord from "discord.js";
import { ILogger, IWebhookConfig } from "../api";

export class DiscordWebhook {
  private hook: Discord.WebhookClient;

  constructor(cfg: IWebhookConfig, logger: ILogger) {
    this.hook = new Discord.WebhookClient(cfg.id, cfg.token);
  }

  public send(
      content: Discord.StringResolvable,
      options?: Discord.WebhookMessageOptions|Discord.Attachment|Discord.RichEmbed)
      : Promise<(Discord.Message|Discord.Message[]|object|object[])> {
    return this.hook.send(content, options);
  }
}
