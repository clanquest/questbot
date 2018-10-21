import { IBotConfig, ILogger, IWebhookConfig } from './api'
import { QuestBot } from './QuestBot'
import { DiscordWebhook } from './webhooks/DiscordWebhook';

const logger: ILogger = console

class Program {
  public static runBot() {
    let cfg = require('./../bot.json') as IBotConfig
    try {
      const cfgProd = require('./../bot.prod.json') as IBotConfig
      cfg = { ...cfg, ...cfgProd }
    } catch {
      logger.info('Create a \'bot.prod.json\' file to use actual settings for the bot.')
    }
    const bot = new QuestBot(cfg, logger);
    bot.start();
  }

  public static sendHook() {
    let cfg = require('./../webhook.json') as IWebhookConfig
    try {
      const cfgProd = require('./../webhook.prod.json') as IBotConfig
      cfg = { ...cfg, ...cfgProd }
    } catch {
      logger.info('Create a \'webhook.prod.json\' file to use actual settings for the bot.')
    }
    const hook = new DiscordWebhook(cfg, logger);
  }
}
