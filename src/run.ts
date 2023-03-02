import { readFile } from "fs/promises";
import { IBotConfig, ILogger, IRuleConfig } from "./api.js";
import { keyv } from "./bot/keyv.js";
import { QuestBot } from "./bot/QuestBot.js";
import { Rules } from "./bot/Rules.js";

const logger: ILogger = console;

export async function runBot() {
  let cfg = await loadConfig<IBotConfig>("./../bot.json");
  try {
    const cfgProd = await loadConfig<IBotConfig>("./../bot.prod.json");
    cfg = { ...cfg, ...cfgProd };
  } catch {
    logger.info("Create a 'bot.prod.json' file to use actual settings for the bot.");
  }

  keyv.on("error", err => logger.error("Keyv connection error: ", err));

  const rules = await loadConfig<IRuleConfig>("./../rules.json");
  Rules.initialize(rules);

  const bot = new QuestBot(cfg);
  await bot.start();
}

async function loadConfig<T>(path: string): Promise<T> {
  const json = (await readFile(new URL(path, import.meta.url))).toString("utf8");
  return JSON.parse(json) as T;
}
