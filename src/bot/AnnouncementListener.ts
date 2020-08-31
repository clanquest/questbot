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

	/**
	 * Starts an AnnouncementListener and sets up events to listen for new messages, 
	 * deleted messages, and edited messages. Messages are then saved to the cq_announcements 
	 * database table.
	 * 
	 * @param client Discord client to operate on
	 */
	public async start(client: Discord.Client) {
		client.on('message', async (message) => {
			// if no announcement channel set, don't do anything.
			if (message.channel.id != this.announcementChannel)
				return;

			let announcementMessage = this.getAnnouncementMessage(message);
			let embedHref = this.getEmbedHref(message);

			(await this.db).execute('INSERT INTO cq_announcements (id, message, timestamp, embed_href) VALUES (?, ?, ?, ?)', [message.id, announcementMessage, message.createdTimestamp, embedHref]);
		});

		client.on('messageDelete', async (deletedMessage) => {
			// if no announcement channel set, don't do anything.
			if (deletedMessage.channel.id != this.announcementChannel)
				return;

			(await this.db).execute('DELETE FROM cq_announcements WHERE id = ?', [deletedMessage.id]);
		});

		client.on('messageUpdate', async (oldMessage, newMessage) => {
			// if no announcement channel set, don't do anything.
			if (newMessage.channel.id != this.announcementChannel)
				return;
			
			let announcementMessage = this.getAnnouncementMessage(newMessage);
			let embedHref = this.getEmbedHref(newMessage);

			(await this.db).execute('UPDATE cq_announcements SET message = ?, embed_href = ? WHERE id = ?', [announcementMessage, embedHref, oldMessage.id]);
		});
	}

	/**
	 * Parse contents of a message and extract the text or embed data if the text is blank.
	 * 
	 * @param message Discord message announcement to parse for contents.
	 */
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

	/**
	 * Parse a selected message and retrieve an embed url to link to in the news post.
	 * 
	 * @param message Discord message announcement to parse for a hyperlink.
	 */
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
