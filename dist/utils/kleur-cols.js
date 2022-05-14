"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.debug = exports.success = exports.info = exports.warn = exports.err = void 0;
const kleur_1 = __importDefault(require("kleur"));
const err = (text) => {
    console.log(kleur_1.default.red().bold(text));
};
exports.err = err;
const warn = (text) => {
    console.log(kleur_1.default.yellow().bold(text));
};
exports.warn = warn;
const info = (text) => {
    console.log(kleur_1.default.cyan().bold(text));
};
exports.info = info;
const success = (text) => {
    console.log(kleur_1.default.green().bold(text));
};
exports.success = success;
const debug = (text) => {
    console.log(kleur_1.default.magenta().bold(text));
};
exports.debug = debug;
