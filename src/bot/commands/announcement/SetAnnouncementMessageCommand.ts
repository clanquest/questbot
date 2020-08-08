import * as Discord from "discord.js";
import * as Commando from "discord.js-commando";
import { Announcement } from "../../Announcement";
import { successReaction } from "../../constants";

export default class SetAnnouncementMessageCommand extends Commando.Command {
  constructor(client: Commando.CommandoClient) {
    super(client, {
      args: [{
        key: "message",
        prompt: "message",
        type: "string",
      }],
      description: "Sets the announcement message",
      details: "Sets the message that should be used for the announcement.",
      group: "announcement",
      guildOnly: true,
      memberName: "announcement-message",
      name: "announcement-message",
      userPermissions: [ "MANAGE_MESSAGES" ],
    });
  }

  public async run(msg: Commando.CommandoMessage, { message }: { message: string })
      : Promise<(Discord.Message|Discord.Message[])> {
    const announcement = Announcement.forGuild(msg.guild);
    if (!announcement) {
      return await msg.reply("There is no announcement to update!");
    }

    announcement.message = message;

    await msg.react(successReaction);

    return [];
  }
}
