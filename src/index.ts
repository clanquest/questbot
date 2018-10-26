import * as Program from "commander";
import { ILogger } from "./api";
import { runBot, sendHook } from "./commands";

Program
    .version("0.1");

Program
    .command("runBot")
    .alias("bot")
    .alias("b")
    .description("Run QuestBot using the configurion in bot.prod.json.")
    .action(runBot);

Program
    .command("sendHook")
    .alias("hook")
    .alias("h")
    .description("Send webhook using the configuration in webhook.prod.json.")
    .action(sendHook);

if (!process.argv.slice(2).length) {
  Program.outputHelp();
  process.exit();
}

Program.parse(process.argv);
