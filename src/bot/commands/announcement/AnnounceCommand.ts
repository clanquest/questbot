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
      ],
      description: "Send an announcement",
      details: "Sends the announcement that is currently under construction.",
      group: "announcement",
      memberName: "announce",
      name: "announce",
    });
  }

  public async run(msg: Commando.CommandMessage, { channel }: { channel: Discord.TextChannel })
      : Promise<(Discord.Message|Discord.Message[])> {
    const announcement = Announcement.instance;
    if (!announcement) {
      return await msg.reply("There is no announcement to make!");
    }

    return await channel.send(announcement.message, announcement.toEmbed());
  }
}
