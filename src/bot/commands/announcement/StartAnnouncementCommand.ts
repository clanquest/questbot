import * as Discord from "discord.js";
import * as Commando from "discord.js-commando";
import { Announcement } from "../../Announcement";

export default class StartAnnouncementCommand extends Commando.Command {
  constructor(client: Commando.CommandoClient) {
    super(client, {
      description: "Starts building an announcement",
      details: "Starts the process of building an announcement that can be sent or previewed.",
      group: "announcement",
      guildOnly: true,
      memberName: "announcement-start",
      name: "announcement-start",
      userPermissions: [ "MANAGE_MESSAGES" ],
    });
  }

  public async run(msg: Commando.CommandoMessage)
      : Promise<(Discord.Message|Discord.Message[])> {
    Announcement.startNew(msg.guild);

    await msg.react("👍");

    return [];
  }
}
