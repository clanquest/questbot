import {  ChatInputCommandInteraction, PermissionFlagsBits , SlashCommandBuilder, TextChannel } from "discord.js";
import { Announcement } from "../Announcement";

export const data = new SlashCommandBuilder()
    .setName("announcement")
    .setDescription("Create and publish announcements")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand(subcommand => subcommand
        .setName("start")
        .setDescription("Start creating a new announcement"))
    .addSubcommand(subcommand => subcommand
        .setName("announce")
        .setDescription("Announces the announcement")
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("The channel to publish the announcement in")
            .setRequired(true))
        .addBooleanOption(option => option
            .setName("mentionEveryone")
            .setDescription("Whether @everyone should be mentioned")))
    .addSubcommand(subcommand => subcommand
        .setName("message")
        .setDescription("Updates the message of the announcement")
        .addStringOption(option => option.setName("value").setRequired(true)))
    .addSubcommand(subcommand => subcommand
        .setName("title")
        .setDescription("Updates the title of the announcement")
        .addStringOption(option => option.setName("value").setRequired(true)))
    .addSubcommand(subcommand => subcommand
        .setName("description")
        .setDescription("Updates the description of the announcement")
        .addStringOption(option => option.setName("value").setRequired(true)))
    .addSubcommand(subcommand => subcommand
        .setName("url")
        .setDescription("Updates the url of the announcement")
        .addStringOption(option => option.setName("value").setRequired(true)))
    .addSubcommand(subcommand => subcommand
        .setName("imageurl")
        .setDescription("Updates the image url of the announcement")
        .addStringOption(option => option.setName("value").setRequired(true)))
    .addSubcommand(subcommand => subcommand
        .setName("thumbnailurl")
        .setDescription("Updates the thumbnail url of the announcement")
        .addStringOption(option => option.setName("value").setRequired(true)));

const modificationSubcommands = [ "message", "title", "description", "url", "imageurl", "thumbnailurl" ];

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  if (interaction.guild == null) {
    return;
  }

  const subcommand = interaction.options.getSubcommand(true);
  if (subcommand === "start") {
    const newAnnouncement = Announcement.startNew(interaction.guild);
    await interaction.reply("You have 15 minutes to build your announcement and post it. A preview will be shown here.");
    newAnnouncement.startInteraction = interaction;
    return;
  }

  const announcement = Announcement.forGuild(interaction.guild);
  if (!announcement) {
    await interaction.reply("Start a new announcement first with the /announcement start command.");
    return;
  }

  if (subcommand === "announce") {
    await announce(interaction, announcement);
    return;
  } else if (modificationSubcommands.indexOf(subcommand) >= 0) {
    const value = interaction.options.getString("value", true);
    updateAnnouncement(subcommand, value, announcement);
    await updatePreview(announcement)
  }
}

async function announce(interaction: ChatInputCommandInteraction, announcement: Announcement): Promise<void> {
  const channel = interaction.options.getChannel("channel", true);
  const everyone = interaction.options.getBoolean("mentionEveryone", false) ?? false;
  const message = `${everyone ? "@everyone " : ""}${announcement.message ? announcement.message : ""}`;
  const textChannel = channel as TextChannel | undefined;
  if (!textChannel) {
    await interaction.reply("Provided channel is not a valid text channel.");
    return;
  }
  await textChannel.send({ content: message, embeds: [announcement.toEmbed()] });
}

function updateAnnouncement(subcommand: string, value: string, announcement: Announcement): void {
  switch (subcommand) {
    case "message":
      announcement.message = value;
      break;
    case "title":
      announcement.embedTitle = value;
      break;
    case "description":
      announcement.embedDescription = value;
      break;
    case "url":
      announcement.embedUrl = value;
      break;
    case "imageurl":
      announcement.embedImageUrl = value;
      break;
    case "thumbnailurl":
      announcement.embedThumbnailUrl = value;
      break;
  }
}

async function updatePreview(announcement: Announcement): Promise<void> {
  await announcement.startInteraction?.editReply({ content: announcement.message, embeds: [announcement.toEmbed()] });
}
