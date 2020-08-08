import * as Discord from "discord.js";
import * as Commando from "discord.js-commando";
import { Announcement } from "../../Announcement";

export default class SetAnnouncementTitleCommand extends Commando.Command {
  constructor(client: Commando.CommandoClient) {
    super(client, {
      args: [{
        key: "description",
        prompt: "description",
        type: "string",
      }],
      description: "Sets the announcement description",
      details: "Sets the description that should be used for the announcement.",
      group: "announcement",
      memberName: "announcement-description",
      name: "announcement-description",
    });
  }

  public async run(msg: Commando.CommandMessage, { description }: { description: string })
      : Promise<(Discord.Message|Discord.Message[])> {
    const announcement = Announcement.instance;
    if (!announcement) {
      return await msg.reply("There is no announcement to update!");
    }

    announcement.embedDescription = description;

    await msg.react("👍");

    return [];
  }
}
