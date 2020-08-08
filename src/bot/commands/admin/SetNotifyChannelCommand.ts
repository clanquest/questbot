import * as Discord from "discord.js";
import * as Commando from "discord.js-commando";
import {  notifyChannelKey, successReaction } from "../../constants";

export default class SetNotifyChannelCommand extends Commando.Command {
  constructor(client: Commando.CommandoClient) {
    super(client, {
      args: [
        {
          key: "channel",
          prompt: "channel",
          type: "channel",
        },
      ],
      description: "Sets a channel as notification channel for this bot",
      details: "Sets a channel as notification channel for this bot.",
      group: "admin",
      guildOnly: true,
      memberName: "notify-channel",
      name: "notify-channel",
      userPermissions: ["ADMINISTRATOR"],
    });
  }

  public async run(msg: Commando.CommandoMessage, { channel }: { channel: Discord.TextChannel })
      : Promise<(Discord.Message|Discord.Message[])> {
    await msg.client.settings.set(notifyChannelKey, channel.id);

    await msg.react(successReaction);

    return [];
  }
}
