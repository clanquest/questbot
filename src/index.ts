import { IBotConfig, ILogger } from './api'
import { QuestBot } from './QuestBot'

const logger: ILogger = console

let cfg = require('./../bot.json') as IBotConfig
try {
  const cfgProd = require('./../bot.prod.json') as IBotConfig
  cfg = { ...cfg, ...cfgProd }
} catch {
  logger.info('Create a \'bot.prod.json\' file to use actual settings for the bot.')
}

const bot = new QuestBot(cfg, logger);
bot.start();
