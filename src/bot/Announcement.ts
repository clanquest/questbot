import * as Discord from "discord.js";

export class Announcement {
  public static startNew(guild: Discord.Guild): void {
    this.instances.set(guild.id, new Announcement());
  }

  public static forGuild(guild: Discord.Guild): Announcement | undefined {
    return Announcement.instances.get(guild.id);
  }

  private static instances: Map<string, Announcement> = new Map();

  public message?: string;
  public embedTitle?: string;
  public embedDescription?: string;
  public embedUrl?: string;
  public embedImageUrl?: string;
  public embedThumbnailUrl?: string;

  public toEmbed(): Discord.MessageEmbed {
    return new Discord.MessageEmbed({
      description: this.embedDescription,
      image: this.embedImageUrl ? { url: this.embedImageUrl } : undefined,
      thumbnail: this.embedThumbnailUrl ? { url: this.embedThumbnailUrl } : undefined,
      title: this.embedTitle,
      url: this.embedUrl,
    });
  }

  // tslint:disable-next-line: no-empty
  private Announcement() {}
}
