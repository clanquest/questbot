import * as Discord from "discord.js";
import * as MySQL from "mysql2/promise";
import { IBotConfig } from "../api";

export class AnnouncementListener {
    private announcementChannel: string;
    private cfg: IBotConfig;

    constructor(channelID: string, cfg: IBotConfig) {
        this.announcementChannel = channelID;
        this.cfg = cfg;
    }

    /**
     * Starts an AnnouncementListener and sets up events to listen for new messages,
     * deleted messages, and edited messages. Messages are then saved to the cq_announcements
     * database table.
     *
     * @param client Discord client to operate on
     */
    public async start(client: Discord.Client) {
        client.on("message", async (message) => {
            // if no announcement channel set, don't do anything.
            if (message.channel.id !== this.announcementChannel) {
                return;
            }

            const db = MySQL.createConnection({
                database: this.cfg.db,
                host: "localhost",
                password: this.cfg.dbPassword,
                user: this.cfg.dbUser,
            })
            .catch((err) => {
                throw new Error("Unable to connect to database. " + err);
            });
            const announcementMessage = await this.getAnnouncementMessage(message);
            const embedHref = await this.getEmbedHref(message);
            let messageAuthor = null;
            if (message.member) {
                messageAuthor = message.member.nickname ? message.member.nickname : message.author.username;
            }

            (await db).execute("INSERT INTO cq_announcements (id, message, author, timestamp, embed_href) VALUES (?, ?, ?, ?, ?)",
                [message.id, announcementMessage, messageAuthor, message.createdTimestamp, embedHref])
            .catch((err) => {
                throw new Error("Unable to insert into database: " + err);
             });
        });

        client.on("messageDelete", async (deletedMessage) => {
            // if no announcement channel set, don't do anything.
            if (deletedMessage.channel.id !== this.announcementChannel) {
                return;
            }

            const db = MySQL.createConnection({
                database: this.cfg.db,
                host: "localhost",
                password: this.cfg.dbPassword,
                user: this.cfg.dbUser,
            })
            .catch((err) => {
                throw new Error("Unable to connect to database. " + err);
            });

            (await db).execute("DELETE FROM cq_announcements WHERE id = ?", [deletedMessage.id]);
        });

        client.on("messageUpdate", async (oldMessage, newMessage) => {
            // if no announcement channel set, don't do anything.
            if (newMessage.channel.id !== this.announcementChannel) {
                return;
            }

            const db = MySQL.createConnection({
                database: this.cfg.db,
                host: "localhost",
                password: this.cfg.dbPassword,
                user: this.cfg.dbUser,
            })
            .catch((err) => {
                throw new Error("Unable to connect to database. " + err);
            });
            const announcementMessage = await this.getAnnouncementMessage(newMessage);
            const embedHref = await this.getEmbedHref(newMessage);

            (await db).execute("UPDATE cq_announcements SET message = ?, embed_href = ? WHERE id = ?",
                [announcementMessage, embedHref, oldMessage.id])
            .catch((err) => {
                throw new Error("Unable to update database: " + err);
            });
        });
    }

    /**
     * Parse contents of a message and extract the text or embed data if the text is blank.
     *
     * @param message Discord message announcement to parse for contents.
     */
    private async getAnnouncementMessage(message: Discord.Message | Discord.PartialMessage): Promise<string> {
        const fullMessage = message.partial ? await message.fetch() : message as Discord.Message;

        // get the message contents
        let announcementMessage = this.parseMessageMentions(fullMessage);
        announcementMessage += this.parseMessageEmbedMentions(fullMessage);

        return announcementMessage;
    }

    /**
     * Parse a selected message and retrieve an embed url to link to in the news post.
     *
     * @param message Discord message announcement to parse for a hyperlink.
     */
    private async getEmbedHref(message: Discord.Message | Discord.PartialMessage): Promise<string | null> {
        const fullMessage = message.partial ? await message.fetch() : message as Discord.Message;

        let embedHref = null;
        // if we have embeds and the url isn't blank, store it
        if (fullMessage.embeds.length > 0 && fullMessage.embeds[0].url) {
            embedHref = fullMessage.embeds[0].url;
        }

        return embedHref;
    }

    /**
     * Parse mentions found in a message that appears to our AnnouncementListener
     *
     * @param message Discord.Message - Message to parse mentions from
     * @returns string containing parsed message
     */
    private parseMessageMentions(message: Discord.Message): string {
        let messageParsed: string = message.content;
        const channelMentions = message.mentions.channels;
        const memberMentions = message.mentions.members;
        const roleMentions = message.mentions.roles;

        channelMentions.each((channel) => {
            messageParsed = messageParsed.replace("<#" + channel.id + ">", "#" + channel.name);
        });

        roleMentions.each((role) => {
            messageParsed = messageParsed.replace("<@&" + role.id + ">", "@" + role.name);
        });

        if (memberMentions) {
            memberMentions.each((member) => {
                const nickname = member.nickname === null ? member.user.username : member.nickname;
                messageParsed = messageParsed.replace("<@" + member.id + ">", "@" + member.user.username);
                messageParsed = messageParsed.replace("<@!" + member.id + ">", "@" + nickname);
            });
        }

        return messageParsed;
    }

    /**
     * Parse message embed mentions. And return an embed formatted for display on a web page.
     *
     * @param message Discord.Message - Message to parse embeds from
     * @returns string containing parsed embeds to be attached to a message.
     */
    private parseMessageEmbedMentions(message: Discord.Message): string {
        if (message.embeds.length < 1) {
            return "";
        }

        let embedsParsed: string = "";
        const clientChannels = message.client.channels.cache;
        const clientMembers = message.guild?.members.cache;
        const clientRoles = message.guild?.roles.cache;

        message.embeds.forEach((embed, index) => {
            embedsParsed += index > 0 ? "\n\n" : "";

            let embedDescription: string = embed.description as string;
            clientChannels.each((channel) => {
                if (channel.type === "text") {
                    const textChannel = channel as Discord.TextChannel;
                    embedDescription = embedDescription.replace("<#" + textChannel.id + ">", "#" + textChannel.name);
                }
            });

            if (message.guild) { // if the message was sent from a guild get the member and role mentions
                clientMembers?.each((member) => {
                    const nickname = member.nickname === null ? member.user.username : member.nickname;
                    embedDescription = embedDescription.replace("<@" + member.id + ">", "@" + member.user.username);
                    embedDescription = embedDescription.replace("<@!" + member.id + ">", "@" + nickname);
                });

                clientRoles?.each((role) => {
                    embedDescription = embedDescription.replace("<@&" + role.id + ">", "@" + role.name);
                });
            }

            embedsParsed += embedDescription;
        });

        return embedsParsed;
    }
}
