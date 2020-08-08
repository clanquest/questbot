import * as Discord from "discord.js";
import * as Commando from "discord.js-commando";
import { allowedChannelsKey, successReaction } from "../../constants";

export default class DisallowChannelCommand extends Commando.Command {
  constructor(client: Commando.CommandoClient) {
    super(client, {
      description: "Disallows commands in this channel",
      details: "Removes this command from the list of channels in which commands are allowed to be run.",
      group: "admin",
      guildOnly: true,
      memberName: "disallow-channel",
      name: "disallow-channel",
      userPermissions: ["ADMINISTRATOR"],
    });
  }

  public async run(msg: Commando.CommandoMessage)
      : Promise<(Discord.Message|Discord.Message[])> {
    let allowedChannels = msg.client.settings.get(allowedChannelsKey, []) as string[];
    allowedChannels = allowedChannels.filter((val) => val !== msg.channel.id);
    await msg.client.settings.set(allowedChannelsKey, allowedChannels);

    await msg.react(successReaction);

    return [];
  }
}
