import { ChatInputCommandInteraction, PermissionFlagsBits , SlashCommandBuilder } from "discord.js";
import { BotCommand } from "../BotCommand.js";
import { notifyChannelKey, rulesChannelKey } from "../constants.js";
import { keyv } from "../keyv.js";

export class SetChannelCommand extends BotCommand {

  private readonly channelPurposes: IChannelPurpose[] = [
    { id: "notify", name: "Bot updates", settingsKey: notifyChannelKey },
    { id: "rules", name: "Rules", settingsKey: rulesChannelKey },
  ];

  public get data() {
    return new SlashCommandBuilder()
        .setName("setchannel")
        .setDescription("Sets a channel for a specific purpose")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addStringOption(option => option
            .setName("purpose")
            .setDescription("The purpose of the channel")
            .setRequired(true)
            .addChoices(
              ...this.channelPurposes.map(purpose => { return { name: purpose.name, value: purpose.id } })
            ))
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("The channel to use for the purpose")
            .setRequired(true));
  }

  public async execute(interaction: ChatInputCommandInteraction) {
    const key = this.extractKey(interaction.options.getString("purpose", true));
    if (key) {
      await keyv.set(key, interaction.options.getChannel("channel", true).id);
      await interaction.reply({ content: "Setting updated successfully", ephemeral: true });
    }
  }

  private extractKey(purpose: string): string | undefined {
    return this.channelPurposes.find(p => p.id === purpose)?.settingsKey;
  }
}

interface IChannelPurpose {
  id: string;
  name: string;
  settingsKey: string;
}
