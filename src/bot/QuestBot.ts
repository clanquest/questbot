import * as Commando from "discord.js-commando";
import * as ora from "ora";
import * as path from "path";
import { IBotConfig } from "../api";
import { allowedChannelsKey } from "./constants";

export class QuestBot {
  private cfg: IBotConfig;
  private settingProvider: Commando.SettingProvider | Promise<Commando.SettingProvider>;

  private client?: Commando.CommandoClient;

  constructor(cfg: IBotConfig, settingProvider: Commando.SettingProvider | Promise<Commando.SettingProvider>) {
    this.cfg = cfg;
    this.settingProvider = settingProvider;
  }

  public start(): void {
    const spinner = ora("Starting bot").start();

    const commandoConfig: Commando.CommandoClientOptions = {
      commandPrefix: this.cfg.commandPrefix,
      disableMentions: "everyone",
      owner: this.cfg.owner,
    };

    this.client = new Commando.CommandoClient(commandoConfig);

    this.registerCommands();

    this.client.setProvider(this.settingProvider);

    this.client.dispatcher.addInhibitor(commandInhibitor);

    this.client.on("ready", () => {
      if (this.cfg.activity) {
          this.client!.user!.setActivity(this.cfg.activity);
      }
      this.client!.user!.setStatus("online");
      spinner.succeed("Bot started");
    });

    this.client.login(this.cfg.token);
  }

  private registerCommands(): void {
    if (!this.client) {
      throw new Error("Client not initialized when registering commands.");
    }

    this.client.registry
        .registerDefaultTypes()
        .registerDefaultGroups()
        .registerDefaultCommands({
          eval: false,
        })
        .registerGroups([
            ["announcement", "Announcement commands"],
            ["test", "Test commands"],
        ])
        .registerCommandsIn(path.join(__dirname, "commands"));
  }
}

function commandInhibitor(msg: Commando.CommandoMessage): false | string | Commando.Inhibition {
  const commandChannels = msg.client.settings.get(allowedChannelsKey, []) as string[];
  if (commandChannels.includes(msg.channel.id)) {
    return false;
  }

  if (msg.command.group.id === "admin" && msg.member.hasPermission("ADMINISTRATOR")) {
    return false;
  }

  return "You are not allowed to use commands here";
}
