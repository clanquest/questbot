import { ChatInputCommandInteraction, EmbedBuilder, Guild } from "discord.js";

export class Announcement {
  public static startNew(guild: Guild): Announcement {
    const announcement = new Announcement();
    this.instances.set(guild.id, announcement);
    return announcement;
  }

  public static forGuild(guild: Guild): Announcement | undefined {
    return Announcement.instances.get(guild.id);
  }

  private static instances = new Map<string, Announcement>();

  public startInteraction?: ChatInputCommandInteraction;

  public message?: string;
  public embedTitle?: string;
  public embedDescription?: string;
  public embedUrl?: string;
  public embedImageUrl?: string;
  public embedThumbnailUrl?: string;

  public toEmbed(): EmbedBuilder {
    return new EmbedBuilder()
      .setDescription(this.embedDescription ?? null)
      .setImage(this.embedImageUrl ?? null)
      .setThumbnail(this.embedThumbnailUrl ?? null)
      .setTitle(this.embedTitle ?? null)
      .setURL(this.embedUrl ?? null);
  }

  // eslint-disable-next-line no-empty, no-empty-function, @typescript-eslint/no-empty-function
  private constructor() {}
}
