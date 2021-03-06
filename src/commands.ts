import * as Commando from "discord.js-commando";
import * as path from "path";
import * as sqlite from "sqlite";
import { IBotConfig, ILogger, IWebhookConfig } from "./api";
import { QuestBot } from "./bot/QuestBot";
import { DiscordWebhook } from "./webhooks/DiscordWebhook";

const logger: ILogger = console;

export function runBot() {
  let cfg = require("./../bot.json") as IBotConfig;
  try {
    const cfgProd = require("./../bot.prod.json") as IBotConfig;
    cfg = { ...cfg, ...cfgProd };
  } catch {
    logger.info("Create a 'bot.prod.json' file to use actual settings for the bot.");
  }

  const bot = new QuestBot(cfg, getSettingsProvider());
  bot.start();
}

async function getSettingsProvider() {
  const db = await openDatabase();
  return new Commando.SQLiteProvider(db);
}

async function openDatabase() {
  return sqlite.open(path.join(__dirname, "settings.sqlite3"));
}

export function sendHook() {
  let cfg = require("./../webhook.json") as IWebhookConfig;
  try {
    const cfgProd = require("./../webhook.prod.json") as IWebhookConfig;
    cfg = { ...cfg, ...cfgProd };
  } catch {
    logger.info("Create a 'webhook.prod.json' file to use actual settings for the bot.");
  }
  const hook = new DiscordWebhook(cfg, logger);

  hook.send(cfg.message, cfg.messageOptions === undefined ? {} : cfg.messageOptions)
      .then(logger.info)
      .catch(logger.error);
}
