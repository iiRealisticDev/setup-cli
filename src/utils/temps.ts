export const deployCmds = `
import { Command } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import fs from "fs";

export default function deploy() {
  const token = process.env.TOKEN;
  if (!token) throw new Error("Invalid token.");
  const clientId = "";

  const globalCommands: Command[] = [];
  const guildCommands: Record<string, Command[]> = {};
  const commandFiles = fs.readdirSync(__dirname+"/commands").filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command: Command = require(__dirname+\`/commands/\${file}\`);
    console.log(JSON.stringify(command));
    if (command.help.data && !command?.help?.guildId) {
      globalCommands.push(command.help?.data?.toJSON());
    } else if (command.help.data && command.help.guildId) {
      if (!guildCommands[command.help.guildId as keyof typeof guildCommands]) guildCommands[command.help.guildId as keyof typeof guildCommands] = [];
      guildCommands[command.help.guildId as keyof typeof guildCommands].push(command?.help?.data?.toJSON());
    }
  }



  const rest = new REST({ version: "9" }).setToken(token);

  rest.put(Routes.applicationCommands(clientId), { body: globalCommands })
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);

  for (const guildCommand of Object.keys(guildCommands)) {
    rest.put(Routes.applicationGuildCommands(clientId, guildCommand), { body: guildCommands[guildCommand as keyof typeof guildCommands] })
      .then(() => console.log("Successfully registered commands for " + guildCommand))
      .catch(console.error);
  }
}`;

export const botCmdTest = `
import { Client, CommandInteraction, Command } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export const run = async (client: Client, interaction: CommandInteraction) => {
  return interaction.reply({ content: "Test", ephemeral: true });
};

export const help = {
  name: "test",
  aliases: [],
  category: "util",
  args: "",
  info: "Check if the bot's functioning correctly.",
  allowedPerms: ["MEMBER"],
  allowedUsers: ["958951658040217671"],
  guildRequired: false,
  data: new SlashCommandBuilder()
    .setName("test").setDescription("Check if the bot's functioning correctly.")
};
`;

export const discordDTS = `
import { Message, Collection } from "discord.js";

type CommandHelp = {
  name: string;
  aliases: string[],
  guildId?: string?,
  category: string,
  args: string,
  info: string,
  allowedPerms: string[],
  allowedUsers: string[],
  guildRequired: boolean,
  data: SlashCommandBuilder
}

type CommandRun = (client: Client, interaction: CommandInteraction) => void

declare module "discord.js" {
  export interface Client {
    commands: Collection<string, Command>
  }

  export interface Command {
    run: CommandRun,
    help: CommandHelp
  }
}
`;


export const botIndex = `
import { Client, Collection, Command, MessageEmbed, Permissions } from "discord.js";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";

import("./deploycmds.js").then(a => {
  a.default();
});

const bot = new Client({
  intents: [
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_BANS",
    "GUILD_MESSAGES",
    "DIRECT_MESSAGES",
    "GUILD_MESSAGE_REACTIONS"
  ],
  partials: [
    "CHANNEL"
  ]
});

bot.commands = new Collection();

bot.login(process.env.TOKEN);

fs.readdir(__dirname + "/commands/", (err, files) => {
  if (err) throw new Error(err.message);
  const jsFile = files.filter((f) => f.split(".").pop() === "js");
  if (jsFile.length <= 0) {
    return;
  }
  jsFile.forEach(async (f) => {
    const cmd: Command = await import(\`./commands/\${f}\`);
    bot.commands.set(cmd.help.name, cmd);
  });
});

function hasPerm(allowedPermissions: string[], permissions: string[]): boolean {
  return allowedPermissions.some((perm) => permissions.includes(perm));
}

bot.on("ready", async () => {
  bot?.user?.setActivity("your requests for help! | /help", {
    type: "LISTENING",
  });
});

bot.on("interactionCreate", async (interaction) => {
  console.log("received");
  if (!interaction.isCommand()) return;
  const commandFile = bot.commands.get(interaction.commandName);
  if (commandFile) {
    if (commandFile.help.guildRequired == true && !interaction.inGuild()) return interaction.reply("This command must be ran in a server.");
    const allowedPerms = commandFile.help.allowedPerms;
    const allowedUsers = commandFile.help.allowedUsers;
    let userPerms: string[] | string | Readonly<Permissions> | undefined = interaction?.member?.permissions;
    if (userPerms instanceof Permissions) {
      userPerms = userPerms.toArray();
    } else {
      userPerms = [];
    }
    userPerms.push("MEMBER");
    if (interaction.user.id == "822366856668512256") userPerms.push("DEVELOPER");
    if (hasPerm(allowedPerms, userPerms) || allowedUsers.includes(interaction.user.id)) {
      try {
        commandFile.run(bot, interaction);
      } catch (error) {
        await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
      }
    } else {
      const emb = new MessageEmbed()
        .setTitle("Error: Missing required permissions.")
        .setDescription(\`**Required Permission(s):** \${allowedPerms.join(", ") ||"None"}\`)
        .setColor("RED");
      interaction.reply({ embeds: [emb] });

    }
  }
});
`;