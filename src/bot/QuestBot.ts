import { BaseInteraction, ChatInputCommandInteraction, Client, Events, GatewayIntentBits, REST, Routes, TextChannel } from "discord.js";
import ora from "ora";
import * as fs from "fs";
import * as path from "path";
import { IBotCommand, IBotConfig, ILogger } from "../api";
import { AnnouncementListener } from "./AnnouncementListener";
import { notifyChannelKey } from "./constants";
import { keyv } from "./keyv";

const logger: ILogger = console;

export class QuestBot {
  private client?: Client;
  private commands = new Map<string, IBotCommand>();

  constructor(
    private cfg: IBotConfig
  ) {}

  public start(): void {
    const spinner = ora("Starting bot").start();

    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
    this.commands = this.collectCommands();

    this.client.on(Events.ClientReady, async() => {
      spinner.text = "Initializing client";
      await this.initializeClient();
      spinner.text = "Deploying commands";
      await this.deployCommands();
      spinner.succeed("Bot started");
    })

    this.client.on(Events.InteractionCreate, async (interaction: BaseInteraction) => {
      if (!interaction.isChatInputCommand()) return;

      await this.handleCommand(interaction);
    });

    this.client.login(this.cfg.token);
  }

  private async initializeClient(): Promise<void> {
    if (!this.client) {
      throw new Error("Client was marked as ready, but client field wasn't set.");
    }

    if (this.cfg.activity) {
      this.client.user?.setActivity(this.cfg.activity);
    }
    this.client.user?.setStatus("online");

    const notifyChannel = await keyv.get(notifyChannelKey) as string | undefined;
    if (notifyChannel && notifyChannel.length) {
      const channel = (await this.client.channels.fetch(notifyChannel)) as TextChannel;
      await channel?.send("QuestBot has successfully (re)started");
    }

    if (this.cfg.listenChannel) { // if a listen channel is set, setup an announcement listener
      const announcementListener = new AnnouncementListener(this.cfg.listenChannel, this.cfg);

      // cache the messages in our channel
      (this.client?.channels.cache.get(this.cfg.listenChannel) as TextChannel)?.messages.fetch();
      announcementListener.start(this.client);
    }
  }

  private collectCommands(): Map<string, IBotCommand> {
    const commands = new Map<string, IBotCommand>();

    const commandsPath = path.join(__dirname, "commands");
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      if ("data" in command && "execute" in command) {
        commands.set(command.data.name, command);
      } else {
        logger.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
      }
    }

    return commands;
  }

  private async deployCommands(): Promise<void> {
    if (!this.client) {
      throw new Error("Client was marked as ready, but client field wasn't set.");
    }

    const rest = new REST({ version: "10" }).setToken(this.cfg.token);
    const commandList = [...this.commands.values()].map(cmd => cmd.data.toJSON());

    logger.info(`Started refreshing ${ commandList.length } application commands.`);

    await rest.put(Routes.applicationCommands(this.cfg.clientId), { body: commandList });

    logger.info(`Successfully refreshed ${ commandList.length } application commands.`);
  }

  private async handleCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    const command = this.commands.get(interaction.commandName) as IBotCommand | undefined;

    if (!command) {
      logger.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error: any) {
      logger.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
      } else {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }
  }
}
