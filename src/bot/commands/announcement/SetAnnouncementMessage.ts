import * as Discord from "discord.js";
import * as Commando from "discord.js-commando";
import { Announcement } from "../../Announcement";

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
      memberName: "announcement-message",
      name: "announcement-message",
    });
  }

  public async run(msg: Commando.CommandMessage, { message }: { message: string })
      : Promise<(Discord.Message|Discord.Message[])> {
    const announcement = Announcement.instance;
    if (!announcement) {
      return await msg.reply("There is no announcement to update!");
    }

    announcement.message = message;

    await msg.react("👍");

    return [];
  }
}
