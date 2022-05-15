"use strict";
/* eslint-disable no-async-promise-executor */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const node_util_1 = __importDefault(require("node:util"));
const execProm = node_util_1.default.promisify(child_process_1.exec);
const promises_1 = __importDefault(require("fs/promises"));
const temps_1 = require("./temps");
const kleur_cols_1 = require("../utils/kleur-cols");
/*
An object of <string, ModPack> values
Modpacks include deps, devDeps, and an extraSetup method
deps will be installed via `npm i` and devDeps will be installed via `npm i --save-dev`
extraSetup will be ran after all packages are installed.
*/
const modulePacks = {
    bot: {
        deps: ["realistic-database", "discord.js", "D:/Projects/Utils/Logger/logger-1.0.0.tgz", "express", "@discordjs/rest", "ms", "pretty-ms", "lodash"],
        devDeps: ["@discordjs/builders", "minify", "dotenv"],
        extraSetup: (lang) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((res) => __awaiter(void 0, void 0, void 0, function* () {
                // Outputs the message to the console
                (0, kleur_cols_1.debug)("Adding necessary files...");
                // Executes the command to add the necessary directories and .env file
                yield execProm("cd ./src && mkdir commands && cd ../ && echo > ./.env");
                // Creates and writes the necessary content to the select files
                yield promises_1.default.writeFile(`./src/deploycmds.${lang}`, temps_1.deployCmds);
                yield promises_1.default.writeFile(`./src/commands/test.${lang}`, temps_1.botCmdTest);
                yield promises_1.default.writeFile("./src/discord.d.ts", temps_1.discordDTS);
                yield promises_1.default.writeFile("./src/index.ts", temps_1.botIndex);
                // Outputs the message to the console
                (0, kleur_cols_1.success)("Sucessfully added necessary files.");
                res();
            }));
        })
    },
    web: {
        deps: ["express", "body-parser", "lodash", "cookie-parser"],
        devDeps: ["node-sass", "bootstrap", "minify", "uuid", "jquery", "D:/Projects/Utils/Logger/logger-1.0.0.tgz"],
        extraSetup: () => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((res) => __awaiter(void 0, void 0, void 0, function* () {
                // Outputs the message to the console
                (0, kleur_cols_1.debug)("Adding necessary files...");
                // Executes the command to add the necessary directories 
                yield execProm("cd ./src && mkdir pages && mkdir public && mkdir scss");
                // Outputs the message to the console
                (0, kleur_cols_1.success)("Sucessfully added necessary files.");
                res();
            }));
        })
    },
    console: {
        deps: [],
        devDeps: ["kleur", "ora"],
        extraSetup: () => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((res) => __awaiter(void 0, void 0, void 0, function* () {
                // Outputs the message to the console
                (0, kleur_cols_1.debug)("Adding necessary files...");
                // Executes the command to add the necessary directories
                yield execProm("cd ./src && mkdir commands && cd ../");
                // Outputs the message to the console
                (0, kleur_cols_1.success)("Sucessfully added necessary files.");
                res();
            }));
        })
    },
};
exports.default = modulePacks;
