import { ChatInputCommandInteraction, PermissionFlagsBits , SlashCommandBuilder, TextChannel } from "discord.js";
import { BotCommand } from "../BotCommand";
import { rulesChannelKey, rulesMessagesKey } from "../constants";
import { keyv } from "../keyv";
import { Rules } from "../Rules";

export class RefreshRulesCommand extends BotCommand {
  public get data() {
    return new SlashCommandBuilder()
        .setName("refreshrules")
        .setDescription("Writes the rules to the channel as set by the rules channel command. Will edit existing messages if present.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
  }

  public async execute(interaction: ChatInputCommandInteraction) {
    const rulesChannelId = await keyv.get(rulesChannelKey) as string ?? "";
    const rulesChannel = await interaction.client.channels.fetch(rulesChannelId) as TextChannel | undefined;
    if (!rulesChannel) {
      await interaction.reply("Rules channel could not be fetched or was not a text-based channel.");
      return;
    }

    const rulesMessageIds = await keyv.get(rulesMessagesKey) as string[] ?? [];
    const rulesMessages = await Promise.all(rulesMessageIds.map((id) => rulesChannel.messages.fetch(id)));

    const newMessages = await Rules.writeTo(rulesChannel, rulesMessages);
    await keyv.set(rulesMessagesKey, newMessages);

    await interaction.reply({ content: "Rules messages successfully updated", ephemeral: true });
  }
}
