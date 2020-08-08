import * as Discord from "discord.js";

export class Announcement {
  public static get instance(): Announcement {
    return Announcement.inst;
  }

  public static startNew(): void {
    Announcement.inst = new Announcement();
  }

  private static inst: Announcement;

  public message?: string;
  public embedTitle?: string;
  public embedDescription?: string;
  public embedUrl?: string;
  public embedImageUrl?: string;

  public toEmbed(): Discord.RichEmbed {
    return new Discord.RichEmbed({
      description: this.embedDescription,
      image: this.embedImageUrl ? { url: this.embedImageUrl } : undefined,
      title: this.embedTitle,
      url: this.embedUrl,
    });
  }

  // tslint:disable-next-line: no-empty
  private Announcement() {}
}
