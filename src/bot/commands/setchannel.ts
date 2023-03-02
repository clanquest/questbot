import { ChatInputCommandInteraction, PermissionFlagsBits , SlashCommandBuilder } from "discord.js";
import { notifyChannelKey, rulesChannelKey } from "../constants";
import { keyv } from "../keyv";

const channelPurposes: IChannelPurpose[] = [
  { id: "notify", name: "Bot updates", settingsKey: notifyChannelKey },
  { id: "rules", name: "Rules", settingsKey: rulesChannelKey },
];

export const data = new SlashCommandBuilder()
    .setName("setchannel")
    .setDescription("Sets a channel for a specific purpose")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addStringOption(option => option
        .setName("purpose")
        .setDescription("The purpose of the channel")
        .setRequired(true)
        .addChoices(
          ...channelPurposes.map(purpose => { return { name: purpose.name, value: purpose.id } })
        ))
    .addChannelOption(option => option
        .setName("channel")
        .setDescription("The channel to use for the purpose")
        .setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const key = extractKey(interaction.options.getString("purpose", true));
  if (key) {
    await keyv.set(key, interaction.options.getChannel("channel", true).id);
    await interaction.reply({ content: "Setting updated successfully", ephemeral: true });
  }
}

function extractKey(purpose: string): string | undefined {
  return channelPurposes.find(p => p.id === purpose)?.settingsKey;
}

interface IChannelPurpose {
  id: string;
  name: string;
  settingsKey: string;
}
