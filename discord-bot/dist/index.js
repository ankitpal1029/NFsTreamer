"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const { DISCORDJS_BOT_TOKEN } = process.env;
const PREFIX = "$";
const discord_js_1 = require("discord.js");
const client = new discord_js_1.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
client.on("messageCreate", (message) => {
    var _a, _b;
    if (message.author.bot)
        return;
    if (message.content.startsWith(PREFIX)) {
        const [CMD_NAME, ...args] = message.content
            .trim()
            .substring(PREFIX.length)
            .split(/\s+/);
        if (CMD_NAME === "kick") {
            if (!((_a = message.member) === null || _a === void 0 ? void 0 : _a.permissions.has("KICK_MEMBERS"))) {
                message.reply("You do not have permissions to use that");
                return;
            }
            if (args.length == 0) {
                message.reply("Please Provide an ID");
                return;
            }
            const member = (_b = message.guild) === null || _b === void 0 ? void 0 : _b.members.cache.get(args[0]);
            if (member) {
                member
                    .kick()
                    .then((member) => message.channel.send(`${member} was kicked!`))
                    .catch((err) => {
                    console.log(err);
                    message.channel.send(`I don't have permission to do that`);
                });
            }
            else {
                message.channel.send("That member was not found");
            }
        }
        else if (CMD_NAME === "ban") {
            message.channel.send("Banned the user");
        }
    }
});
client.login(DISCORDJS_BOT_TOKEN);
//# sourceMappingURL=index.js.map