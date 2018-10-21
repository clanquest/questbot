import * as Discord from 'discord.js'
import { ILogger, IWebhookConfig } from '../api';

export class DiscordWebhook {

  private _hook: Discord.WebhookClient;

  constructor(cfg: IWebhookConfig, logger: ILogger) {
    this._hook = new Discord.WebhookClient(cfg.id, cfg.token);
  }
}
