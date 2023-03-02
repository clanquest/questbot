import { BaseMessageOptions }from "discord.js";
import { IBotConfig, ILogger } from "./api";
import { keyv } from "./bot/keyv";
import { QuestBot } from "./bot/QuestBot";
import { Rules } from "./bot/Rules";

const logger: ILogger = console;

export async function runBot() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  let cfg = require("./../bot.json") as IBotConfig;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const cfgProd = require("./../bot.prod.json") as IBotConfig;
    cfg = { ...cfg, ...cfgProd };
  } catch {
    logger.info("Create a 'bot.prod.json' file to use actual settings for the bot.");
  }

  keyv.on("error", err => logger.error("Keyv connection error: ", err));

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const rules = require("./../rules.json") as BaseMessageOptions[];
  Rules.initialize(rules);

  const bot = new QuestBot(cfg);
  await bot.start();
}
