import { BaseMessageOptions, Message, TextChannel } from "discord.js";

export class Rules {
  public static initialize(rules: BaseMessageOptions[]) {
    Rules.instance = new Rules(rules);
  }

  public static writeTo(channel: TextChannel, existingMessages: Message[])
      : Promise<Message[]> {
    return this.instance.write(channel, existingMessages);
  }

  private static instance: Rules;

  private rules: BaseMessageOptions[] = [];

  private constructor(rules: BaseMessageOptions[]) {
    this.rules = rules;
  }

  private async write(channel: TextChannel, existingMessages: Message[])
      : Promise<Message[]> {
    for (let i = 0; i < Math.min(this.rules.length, existingMessages.length); i++) {
      await existingMessages[i].edit({
        allowedMentions: {parse: ["roles"]},
        content: this.rules[i].content,
        embeds: this.rules[i].embeds,
      });
    }

    if (this.rules.length > existingMessages.length) {
      const output = Array.from(existingMessages);
      for (let i = existingMessages.length; i < this.rules.length; i++) {
        const msg = await channel.send({
          allowedMentions: {parse: ["roles"]},
          content: this.rules[i].content,
          embeds: this.rules[i].embeds,
        });
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
