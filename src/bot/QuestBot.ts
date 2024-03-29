import { BaseInteraction, ChatInputCommandInteraction, Client, Events, GatewayIntentBits, REST, Routes, TextChannel } from "discord.js";
import { IBotCommand, IBotConfig, ILogger } from "../api.js";
import { AnnouncementListener } from "./AnnouncementListener.js";
import { notifyChannelKey } from "./constants.js";
import { keyv } from "./keyv.js";
import { AnnouncementCommand } from "./commands/AnnouncementCommand.js";
import { RefreshRulesCommand } from "./commands/RefreshRulesCommand.js";
import { SetChannelCommand } from "./commands/SetChannelCommand.js";

const logger: ILogger = console;

export class QuestBot {
  private client?: Client;
  private commands = new Map<string, IBotCommand>();

  constructor(
    private cfg: IBotConfig
  ) {}

  public async start() {
    logger.info("Starting bot...");

    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    });
    this.commands = this.collectCommands();

    this.client.on(Events.ClientReady, async () => {
      await this.initializeClient();
      await this.deployCommands();
      logger.info("Bot started. Running until interrupted.");
    })

    this.client.on(Events.InteractionCreate, async (interaction: BaseInteraction) => {
      if (!interaction.isChatInputCommand()) return;

      await this.handleCommand(interaction);
    });

    await this.client.login(this.cfg.token);
  }

  private async initializeClient() {
    if (!this.client) {
      throw new Error("Client was marked as ready, but client field wasn't set.");
    }

    logger.info("  Initializing client...");

    if (this.cfg.activity) {
      this.client.user?.setActivity(this.cfg.activity);
    }
    this.client.user?.setStatus("online");

    const notifyChannel = await keyv.get(notifyChannelKey) as string | undefined;
    if (notifyChannel?.length) {
      const channel = (await this.client.channels.fetch(notifyChannel)) as TextChannel;
      await channel?.send("QuestBot has successfully (re)started");
    }

    if (this.cfg.listenChannel) { // if a listen channel is set, setup an announcement listener
      const announcementListener = new AnnouncementListener(this.cfg.listenChannel, this.cfg);

      // cache the messages in our channel
      await (this.client?.channels.cache.get(this.cfg.listenChannel) as TextChannel)?.messages.fetch();
      announcementListener.start(this.client);
    }


    logger.info("  Client initialized.");
  }

  private collectCommands(): Map<string, IBotCommand> {
    const commands = [
      new AnnouncementCommand(),
      new RefreshRulesCommand(),
      new SetChannelCommand(),
    ];

    return new Map(commands.map(cmd => [cmd.data.name, cmd]));
  }

  private async deployCommands() {
    if (!this.client) {
      throw new Error("Client was marked as ready, but client field wasn't set.");
    }

    const rest = new REST({ version: "10" }).setToken(this.cfg.token);
    const commandList = [...this.commands.values()].map(cmd => cmd.data.toJSON());

    logger.info(`  Started refreshing ${ commandList.length } application commands...`);

    await rest.put(Routes.applicationCommands(this.cfg.clientId), { body: commandList });

    logger.info(`  Successfully refreshed ${ commandList.length } application commands.`);
  }

  private async handleCommand(interaction: ChatInputCommandInteraction) {
    const command = this.commands.get(interaction.commandName);

    if (!command) {
      logger.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      logger.error("Error executing command", error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: "There was an error while executing this command!", ephemeral: true });
      } else {
        await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
      }
    }
  }
}
