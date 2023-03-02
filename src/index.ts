import * as Program from "commander";
import { ILogger } from "./api";
import { runBot, sendHook } from "./commands";

Program
    .version("0.2");

Program
    .command("runBot")
    .alias("bot, b")
    .description("Run QuestBot using the configurion in bot.prod.json.")
    .action(runBot);

if (!process.argv.slice(2).length) {
  Program.outputHelp();
  process.exit();
}

Program.parse(process.argv);
