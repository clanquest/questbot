import * as Discord from "discord.js";

export class Rules {
  public static initialize(rules: Discord.MessageOptions[]) {
    Rules.instance = new Rules(rules);
  }

  public static writeTo(channel: Discord.TextChannel, existingMessages: Discord.Message[])
      : Promise<Discord.Message[]> {
    return this.instance.write(channel, existingMessages);
  }

  private static instance: Rules;

  private rules: Discord.MessageOptions[] = [];

  private constructor(rules: Discord.MessageOptions[]) {
    this.rules = rules;
  }

  private async write(channel: Discord.TextChannel, existingMessages: Discord.Message[])
      : Promise<Discord.Message[]> {
    for (let i = 0; i < Math.min(this.rules.length, existingMessages.length); i++) {
      await existingMessages[i].edit({content: this.rules[i].content, embed: this.rules[i].embed, disableMentions: "none"});
    }

    if (this.rules.length > existingMessages.length) {
      const output = Array.from(existingMessages);
      for (let i = existingMessages.length; i < this.rules.length; i++) {
        const msg = await channel.send({content: this.rules[i].content, embed: this.rules[i].embed, disableMentions: "none"});
        output.push(msg);
      }
      return output;
    }

    if (this.rules.length < existingMessages.length) {
      for (let i = this.rules.length; i < existingMessages.length; i++) {
        await existingMessages[i].delete();
      }
      return existingMessages.slice(0, this.rules.length);
    }

    return existingMessages;
  }
}
