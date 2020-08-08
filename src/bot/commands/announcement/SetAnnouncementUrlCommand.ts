import * as Discord from "discord.js";
import * as Commando from "discord.js-commando";
import { Announcement } from "../../Announcement";
import { successReaction } from "../../constants";

export default class SetAnnouncementUrlCommand extends Commando.Command {
  constructor(client: Commando.CommandoClient) {
    super(client, {
      args: [{
        key: "url",
        prompt: "url",
        type: "string",
      }],
      description: "Sets the announcement url",
      details: "Sets the url that should be used for the announcement.",
      group: "announcement",
      guildOnly: true,
      memberName: "announcement-url",
      name: "announcement-url",
      userPermissions: [ "MANAGE_MESSAGES" ],
    });
  }

  public async run(msg: Commando.CommandoMessage, { url }: { url: string })
      : Promise<(Discord.Message|Discord.Message[])> {
    const announcement = Announcement.forGuild(msg.guild);
    if (!announcement) {
      return await msg.reply("There is no announcement to update!");
    }

    announcement.embedUrl = url;

    await msg.react(successReaction);

    return [];
  }
}
