/* eslint-disable no-async-promise-executor */

// Imports
import { ModPack } from "./types";
import { exec } from "child_process";
import utils from "node:util";
const execProm = utils.promisify(exec);
import fs from "fs/promises";
import { deployCmds, discordDTS, botCmdTest, botIndex } from "./temps";
import { debug, success } from "../utils/kleur-cols";


/*
An object of <string, ModPack> values
Modpacks include deps, devDeps, and an extraSetup method
deps will be installed via `npm i` and devDeps will be installed via `npm i --save-dev`
extraSetup will be ran after all packages are installed.
*/
const modulePacks: Record<string, ModPack> = {
  bot: {
    deps: ["realistic-database", "discord.js", "express", "@discordjs/rest", "ms", "pretty-ms", "lodash"],
    devDeps: ["@discordjs/builders", "minify", "dotenv"],
    extraSetup: async (lang: string) => {
      return new Promise(async (res) => {
        // Outputs the message to the console
        debug("Adding necessary files...");
        // Executes the command to add the necessary directories and .env file
        await execProm("cd ./src && mkdir commands && cd ../ && echo > ./.env");
        // Creates and writes the necessary content to the select files
        await fs.writeFile(`./src/deploycmds.${lang}`, deployCmds);
        await fs.writeFile(`./src/commands/test.${lang}`, botCmdTest);
        await fs.writeFile("./src/discord.d.ts", discordDTS);
        await fs.writeFile("./src/index.ts", botIndex);
        // Outputs the message to the console
        success("Sucessfully added necessary files.");
        res();
      });
    }
  },
  web: {
    deps: ["express", "body-parser", "lodash", "cookie-parser"],
    devDeps: ["node-sass", "bootstrap", "minify", "uuid", "jquery", "@types/node", "@types/express"],
    extraSetup: async () => {
      return new Promise(async (res) => {
        // Outputs the message to the console
        debug("Adding necessary files...");
        // Executes the command to add the necessary directories 
        await execProm("cd ./src && mkdir pages && mkdir public && mkdir scss");
        // Outputs the message to the console
        success("Sucessfully added necessary files.");
        res();
      });
    }
  },
  console: {
    deps: [],
    devDeps: ["kleur", "ora"],
    extraSetup: async () => {
      return new Promise(async (res) => {
        // Outputs the message to the console
        debug("Adding necessary files...");
        // Executes the command to add the necessary directories
        await execProm("cd ./src && mkdir commands && cd ../");
        // Outputs the message to the console
        success("Sucessfully added necessary files.");
        res();
      });
    }
  },

};

export default modulePacks;