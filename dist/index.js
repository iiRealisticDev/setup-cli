"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./commands/index"));
const kleur_cols_1 = require("./utils/kleur-cols");
const run = () => {
    var _a;
    const args = process.argv.splice(2);
    const command = args[0];
    const cmdExists = (_a = Object.entries(index_1.default).filter((cmd) => {
        return cmd[1].info.name.toLowerCase() === command.toLowerCase();
    })[0]) === null || _a === void 0 ? void 0 : _a[1];
    if (!cmdExists)
        return (0, kleur_cols_1.err)("Command not found");
    cmdExists.run(args.slice(1));
};
run();
