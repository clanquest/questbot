import * as Discord from "discord.js";
import * as Commando from "discord.js-commando";
import { allowedChannelsKey, successReaction } from "../../constants";

export default class AllowChannelCommand extends Commando.Command {
  constructor(client: Commando.CommandoClient) {
    super(client, {
      description: "Allows commands in this channel",
      details: "Adds this command to a list of channels in which commands are allowed to be run.",
      group: "admin",
      guildOnly: true,
      memberName: "allow-channel",
      name: "allow-channel",
      userPermissions: ["ADMINISTRATOR"],
    });
  }

  public async run(msg: Commando.CommandoMessage)
      : Promise<(Discord.Message|Discord.Message[])> {
    const allowedChannels = msg.client.settings.get(allowedChannelsKey, []) as string[];
    if (!allowedChannels.includes(msg.channel.id)) {
      allowedChannels.push(msg.channel.id);
      await msg.client.settings.set(allowedChannelsKey, allowedChannels);
    }

    await msg.react(successReaction);

    return [];
  }
}
