import * as Discord from "discord.js";
import * as Commando from "discord.js-commando";
import { Announcement } from "../../Announcement";
import { successReaction } from "../../constants";

export default class SetAnnouncementTitleCommand extends Commando.Command {
  constructor(client: Commando.CommandoClient) {
    super(client, {
      args: [{
        key: "title",
        prompt: "title",
        type: "string",
      }],
      description: "Sets the announcement title",
      details: "Sets the title that should be used for the announcement.",
      group: "announcement",
      guildOnly: true,
      memberName: "announcement-title",
      name: "announcement-title",
      userPermissions: [ "MANAGE_MESSAGES" ],
    });
  }

  public async run(msg: Commando.CommandoMessage, { title }: { title: string })
      : Promise<(Discord.Message|Discord.Message[])> {
    const announcement = Announcement.forGuild(msg.guild);
    if (!announcement) {
      return await msg.reply("There is no announcement to update!");
    }

    announcement.embedTitle = title;

    await msg.react(successReaction);

    return [];
  }
}
