import * as Discord from "discord.js";
import * as Commando from "discord.js-commando";
import { rulesChannelKey, rulesMessagesKey, successReaction } from "../../constants";
import { Rules } from "../../Rules";

export default class WriteRulesCommand extends Commando.Command {
  constructor(client: Commando.CommandoClient) {
    super(client, {
      description: "Writes the rules to the rules channel",
      details: "Writes the rules to the channel as set by the rules channel command. Will edit existing messages if present.",
      group: "admin",
      guildOnly: true,
      memberName: "refresh-rules",
      name: "refresh-rules",
      userPermissions: ["ADMINISTRATOR"],
    });
  }

  public async run(msg: Commando.CommandoMessage)
      : Promise<(Discord.Message|Discord.Message[])> {
    const rulesChannelId = msg.client.settings.get(rulesChannelKey) as Discord.Snowflake | undefined;

    if (!rulesChannelId || rulesChannelId.length) {
      return await msg.reply("No rules channel set. Cannot refresh rules.");
    }

    const rulesChannel = (await msg.client.channels.fetch(rulesChannelId)) as Discord.TextChannel;
    const rulesMessageIds = msg.client.settings.get(rulesMessagesKey) as Discord.Snowflake[] | undefined ?? [];

    const rulesMessages = await Promise.all(rulesMessageIds.map((id) => rulesChannel.messages.fetch(id)));

    const newMessages = await Rules.writeTo(rulesChannel, rulesMessages);

    await msg.client.settings.set(rulesMessagesKey, newMessages.map((m) => m.id));

    await msg.react(successReaction);
    return [];
  }
}
