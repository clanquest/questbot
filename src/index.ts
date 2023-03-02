import { program } from "@commander-js/extra-typings";
import { runBot } from "./run";

program
    .name("questbot")
    .description("CLI to run questbot for the Clan Quest Discord")
    .version("0.2");

program.parse();

runBot();
