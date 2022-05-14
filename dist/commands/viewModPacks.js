"use strict";
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
exports.info = exports.run = void 0;
const kleur_cols_1 = require("../utils/kleur-cols");
const kleur_1 = __importDefault(require("kleur"));
const modulePacks_1 = __importDefault(require("../utils/modulePacks"));
const run = (args) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const pack = (_a = args[0]) !== null && _a !== void 0 ? _a : "all";
    if (pack == "all") {
        const entries = [];
        for (const modulePack of Object.entries(modulePacks_1.default)) {
            entries.push(`${kleur_1.default.blue(modulePack[0])}\nDependencies: ${kleur_1.default.magenta(modulePack[1].deps.join(", "))}\nDev Dependencies: ${kleur_1.default.yellow(modulePack[1].devDeps.join(", "))}`);
        }
        (0, kleur_cols_1.info)(entries.join("\n\n"));
    }
    else {
        const modpack = modulePacks_1.default[pack];
        if (!modpack)
            return (0, kleur_cols_1.err)("No modpack with given name found.");
        (0, kleur_cols_1.info)(`${kleur_1.default.blue(pack)}:\nDependencies: ${kleur_1.default.magenta(modpack.deps.join(", "))}\nDev Dependencies: ${kleur_1.default.yellow(modpack.devDeps.join(", "))}`);
    }
});
exports.run = run;
exports.info = {
    name: "view-mod-packs",
    description: "View module packs.",
    usage: "view-mod-packs [pack]",
};
exports.default = { run: exports.run, info: exports.info };
