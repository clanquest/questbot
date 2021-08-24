import * as Discord from "discord.js";
import * as Commando from "discord.js-commando";
import { rulesChannelKey, rulesMessagesKey, successReaction } from "../../constants";

export default class SetRulesChannel extends Commando.Command {
  constructor(client: Commando.CommandoClient) {
    super(client, {
      args: [
        {
          key: "channel",
          prompt: "channel",
          type: "channel",
        },
      ],
      description: "Writes the rules to the rules channel",
      details: "Writes the rules to the channel as set by the rules channel command. Will edit existing messages if present.",
      group: "admin",
      guildOnly: true,
      memberName: "rules-channel",
      name: "rules-channel",
      userPermissions: ["ADMINISTRATOR"],
    });
  }

  public async run(msg: Commando.CommandoMessage, { channel }: { channel: Discord.TextChannel })
      : Promise<(Discord.Message|Discord.Message[])> {
    const currentChannelId = msg.client.settings.get(rulesChannelKey);
    const currentChannel = (await msg.client.channels.fetch(currentChannelId)) as Discord.TextChannel;

    if (currentChannel?.id === channel.id) {
      return await msg.reply("Tried setting the rules channel to the existing channel.");
    }

    await msg.client.settings.set(rulesChannelKey, channel.id);
    await msg.client.settings.set(rulesMessagesKey, []);
    await msg.react(successReaction);

    return [];
  }
}
