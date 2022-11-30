import * as Discord from "discord.js";
import * as Commando from "discord.js-commando";
import { Announcement } from "../../Announcement";
import { successReaction } from "../../constants";

export default class SetAnnouncementThumbnailCommand extends Commando.Command {
  constructor(client: Commando.CommandoClient) {
    super(client, {
      args: [{
        key: "thumbnailUrl",
        prompt: "thumbnailUrl",
        type: "string",
      }],
      description: "Sets the announcement thumbnail (should be a URL)",
      details: "Sets the thumbnail that should be used for the announcement.",
      group: "announcement",
      guildOnly: true,
      memberName: "announcement-thumb",
      name: "announcement-thumb",
      userPermissions: [ "MANAGE_MESSAGES" ],
    });
  }

  public async run(msg: Commando.CommandoMessage, { thumbnailUrl }: { thumbnailUrl: string })
      : Promise<(Discord.Message|Discord.Message[])> {
    const announcement = Announcement.forGuild(msg.guild);
    if (!announcement) {
      return await msg.reply("There is no announcement to update!");
    }

    announcement.embedThumbnailUrl = thumbnailUrl;

    await msg.react(successReaction);

    return [];
  }
}
