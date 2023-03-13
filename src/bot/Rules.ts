import { EmbedBuilder, Message, TextChannel } from "discord.js";
import { IRuleConfig, IRuleSection } from "../api.js";

export class Rules {
  public static initialize(rules: IRuleConfig) {
    Rules.instance = new Rules(rules);
  }

  public static writeTo(channel: TextChannel, existingMessages: Message[])
      : Promise<Message[]> {
    return this.instance.write(channel, existingMessages);
  }

  private static instance: Rules;

  private constructor(private rules: IRuleConfig) {}

  private async write(channel: TextChannel, existingMessages: Message[])
      : Promise<Message[]> {
    const sections = this.rules.sections;

    for (let i = 0; i < Math.min(sections.length, existingMessages.length); i++) {
      await existingMessages[i].edit({
        allowedMentions: {parse: ["roles"]},
        content: "",
        embeds: [this.toEmbed(sections[i])],
      });
    }

    if (sections.length > existingMessages.length) {
      const output = Array.from(existingMessages);
      for (let i = existingMessages.length; i < sections.length; i++) {
        const msg = await channel.send({
          allowedMentions: {parse: ["roles"]},
          content: "",
          embeds: [this.toEmbed(sections[i])],
        });
        output.push(msg);
      }
      return output;
    }

    if (sections.length < existingMessages.length) {
      for (let i = sections.length; i < existingMessages.length; i++) {
        await existingMessages[i].delete();
      }
      return existingMessages.slice(0, sections.length);
    }

    return existingMessages;
  }

  private toEmbed(section: IRuleSection): EmbedBuilder {
    return new EmbedBuilder()
        .setColor(section.color)
        .setTitle(section.title)
        .setDescription(section.description);
  }
}
