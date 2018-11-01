import * as Discord from "discord.js";
import * as Commando from "discord.js-commando";

export class TestCommand extends Commando.Command {
  constructor(client: Commando.CommandoClient) {
    super(client, {
      description: "A test command",
      details: "This command is used for testing the new command framework.",
      group: "test",
      memberName: "test",
      name: "test",
    });
  }

  public async run(msg: Commando.CommandMessage, args: object | string | string[])
      : Promise<(Discord.Message|Discord.Message[])> {
    return await msg.reply("Test message received!");
  }
}
