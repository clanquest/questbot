import { BaseMessageOptions }from "discord.js";
import { IBotConfig, ILogger } from "./api";
import { keyv } from "./bot/keyv";
import { QuestBot } from "./bot/QuestBot";
import { Rules } from "./bot/Rules";

const logger: ILogger = console;

export function runBot() {
  let cfg = require("./../bot.json") as IBotConfig;
  try {
    const cfgProd = require("./../bot.prod.json") as IBotConfig;
    cfg = { ...cfg, ...cfgProd };
  } catch {
    logger.info("Create a 'bot.prod.json' file to use actual settings for the bot.");
  }

  keyv.on("error", err => logger.error("Keyv connection error: ", err));

  const rules = require("./../rules.json") as BaseMessageOptions[];
  Rules.initialize(rules);

  const bot = new QuestBot(cfg);
  bot.start();
}
