import * as Discord from "discord.js";
import * as Commando from "discord.js-commando";
import { Announcement } from "../../Announcement";

export default class PreviewCommand extends Commando.Command {
  constructor(client: Commando.CommandoClient) {
    super(client, {
      description: "Preview an announcement",
      details: "Previews the announcement that is currently under construction.",
      group: "announcement",
      guildOnly: true,
      memberName: "preview",
      name: "preview",
      userPermissions: [ "MANAGE_MESSAGES" ],
    });
  }

  public async run(msg: Commando.CommandoMessage)
      : Promise<(Discord.Message|Discord.Message[])> {
    const announcement = Announcement.forGuild(msg.guild);
    if (!announcement) {
      return await msg.reply("There is no announcement to preview!");
    }

    return await msg.channel.send(announcement.message, announcement.toEmbed());
  }
}
