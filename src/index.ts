import { IBotConfig, ILogger, IWebhookConfig } from './api'
import { QuestBot } from './bot/QuestBot'
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
      const cfgProd = require('./../webhook.prod.json') as IWebhookConfig
      cfg = { ...cfg, ...cfgProd }
    } catch {
      logger.info('Create a \'webhook.prod.json\' file to use actual settings for the bot.')
    }
    const hook = new DiscordWebhook(cfg, logger);

    hook.send('', {
            embeds: [{
              title: 'Questholic October 2018',
              description: 'The new magazine issue is out now!',
              url: 'https://clanquest.org/wiki/Questaholic_-_October_2018',
              image: {url: 'https://clanquest.org/wiki/images/thumb/7/78/October_2018_001_%28Cover%29.png/463px-October_2018_001_%28Cover%29.png'}
            }],
          })
        .then(logger.info)
        .catch(logger.error);
  }
}

Program.sendHook();
