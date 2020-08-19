import * as Discord from "discord.js";
import * as MySQL from "mysql2/promise";
import { IBotConfig } from "../api";

export class AnnouncmentListener {
	private announcementChannel: string;
	private db: Promise<MySQL.Connection>;

	constructor(channelID: string, cfg: IBotConfig) {
		this.announcementChannel = channelID;
		this.db = MySQL.createConnection({
			host: 'localhost',
			user: cfg.dbUser,
			password: cfg.dbPassword,
			database: cfg.db
		})
		.catch(err => {
			throw new Error("Unable to connect to database. " + err);
		});
	}

	public async start(client: Discord.Client) {
		client.on('message', async (message) => {
			if (message.channel.id != this.announcementChannel)
				return;

			let announcementMessage = this.getAnnouncementMessage(message);
			let embedHref = this.getEmbedHref(message);

			(await this.db).execute('INSERT INTO cq_announcements (id, message, timestamp, embed_href) VALUES (?, ?, ?, ?)', [message.id, announcementMessage, message.createdTimestamp, embedHref]);
		});

		client.on('messageDelete', async (deletedMessage) => {
			if (deletedMessage.channel.id != this.announcementChannel)
				return;

			(await this.db).execute('DELETE FROM cq_announcements WHERE id = ?', [deletedMessage.id]);
		});

		client.on('messageUpdate', async (oldMessage, newMessage) => {
			if (newMessage.channel.id != this.announcementChannel)
				return;
			
			let announcementMessage = this.getAnnouncementMessage(newMessage);
			let embedHref = this.getEmbedHref(newMessage);

			(await this.db).execute('UPDATE cq_announcements SET message = ?, embed_href = ? WHERE id = ?', [announcementMessage, embedHref, oldMessage.id]);
		});
	}

	private getAnnouncementMessage(message: Discord.Message | Discord.PartialMessage): string {
		if (message.partial) // we have a partial message, upgrade it
			message.fetch();
		message = message as Discord.Message;

		// get the message contents
		let announcementMessage = message.cleanContent;
		if (announcementMessage == "" && message.embeds.length > 0) // if it's empty and we have an embed, use that instead
			announcementMessage = message.embeds[0].description as string;
		
		return announcementMessage;
	}

	private getEmbedHref(message: Discord.Message | Discord.PartialMessage): string | null {
		if (message.partial) // we have a partial message, upgrade it
			message.fetch();
		message = message as Discord.Message;

		let embedHref = null;
		// if we have embeds and the url isn't blank, store it
		if (message.embeds.length > 0 && message.embeds[0].url)
			embedHref = message.embeds[0].url;

		return embedHref;
	}
}