import * as Discord from "discord.js";
import * as Commando from "discord.js-commando";
import { Announcement } from "../../Announcement";
import { successReaction } from "../../constants";

export default class SetAnnouncementImageCommand extends Commando.Command {
  constructor(client: Commando.CommandoClient) {
    super(client, {
      args: [{
        key: "imageUrl",
        prompt: "imageUrl",
        type: "string",
      }],
      description: "Sets the announcement image (should be a URL)",
      details: "Sets the image that should be used for the announcement.",
      group: "announcement",
      guildOnly: true,
      memberName: "announcement-image",
      name: "announcement-image",
      userPermissions: [ "MANAGE_MESSAGES" ],
    });
  }

  public async run(msg: Commando.CommandoMessage, { imageUrl }: { imageUrl: string })
      : Promise<(Discord.Message|Discord.Message[])> {
    const announcement = Announcement.forGuild(msg.guild);
    if (!announcement) {
      return await msg.reply("There is no announcement to update!");
    }

    announcement.embedImageUrl = imageUrl;

    await msg.react(successReaction);

    return [];
  }
}
