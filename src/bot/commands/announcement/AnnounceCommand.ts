import * as Discord from "discord.js";
import * as Commando from "discord.js-commando";
import { Announcement } from "../../Announcement";

export default class AnnounceCommand extends Commando.Command {
  constructor(client: Commando.CommandoClient) {
    super(client, {
      args: [
        {
          key: "channel",
          prompt: "channel",
          type: "channel",
        },
        {
          default: false,
          key: "everyone",
          prompt: "everyone",
          type: "boolean",
        },
      ],
      description: "Send an announcement",
      details: "Sends the announcement that is currently under construction.",
      group: "announcement",
      guildOnly: true,
      memberName: "announce",
      name: "announce",
      userPermissions: [ "MANAGE_MESSAGES" ],
    });
  }

  public async run(
      msg: Commando.CommandoMessage,
      { channel, everyone }: ICommandArgs,
      ): Promise<(Discord.Message|Discord.Message[])> {
    const announcement = Announcement.forGuild(msg.guild);
    if (!announcement) {
      return await msg.reply("There is no announcement to make!");
    }

    const message = `${everyone ? "@everyone " : ""} ${announcement.message}`;

    return await channel.send(message, announcement.toEmbed());
  }
}

interface ICommandArgs {
  channel: Discord.TextChannel;
  everyone: boolean;
}
