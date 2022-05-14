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
const child_process_1 = require("child_process");
const node_util_1 = __importDefault(require("node:util"));
const execProm = node_util_1.default.promisify(child_process_1.exec);
const kleur_cols_1 = require("../utils/kleur-cols");
const promises_1 = __importDefault(require("fs/promises"));
const modulePacks_1 = __importDefault(require("../utils/modulePacks"));
const tsConfigTemplate = "{\n  \"compilerOptions\": {\n    \"target\": \"es2016\",\n    \"module\": \"CommonJS\",\n    \"esModuleInterop\": true,\n    \"forceConsistentCasingInFileNames\": true,\n    \"strict\": true,\n    \"skipLibCheck\": true,\n    \"outDir\": \"./dist\",\n    \"resolveJsonModule\": true,\n    \"charset\": \"utf8\"\n  },\n  \"include\": [\"./src\"]\n}";
const run = (args) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const lang = (_a = args[0]) !== null && _a !== void 0 ? _a : "ts";
    const cwd = process.cwd();
    if (!["ts", "js"].includes(lang)) {
        (0, kleur_cols_1.err)("Invalid language. Only js and ts are supported.");
        process.exit(0);
    }
    const modules = (_c = (_b = args === null || args === void 0 ? void 0 : args.splice(1)) === null || _b === void 0 ? void 0 : _b.join(" ")) !== null && _c !== void 0 ? _c : "bot";
    (0, kleur_cols_1.debug)("Building...");
    yield execProm("npm init -y");
    if (lang == "ts") {
        (0, kleur_cols_1.debug)("Setting up environment for TypeScript...");
        yield promises_1.default.writeFile("./tsconfig.json", tsConfigTemplate);
        yield execProm(`npm i --save-dev @types/node && mkdir src && mkdir dist && echo console.log("Hello World"); > ${cwd}/src/index.ts`);
        (0, kleur_cols_1.success)("Setup environment for TypeScript successfully.");
    }
    else if (lang == "js") {
        (0, kleur_cols_1.debug)("Setting up environment for JavaScript...");
        yield execProm("echo console.log(\"Hello World\"); > src/index.js");
        (0, kleur_cols_1.success)("Setup environment for JavaScript successfully.");
    }
    for (const currModule of modules.split(" ")) {
        const modulePack = modulePacks_1.default[currModule];
        if (modulePack) {
            if (modulePack.deps) {
                (0, kleur_cols_1.debug)(`Installing dependencies... ${modulePack.deps.join(" ")}...`);
                yield execProm(`npm i ${modulePack.deps.join(" ")}`);
            }
            if (modulePack.devDeps) {
                (0, kleur_cols_1.debug)(`Installing dev dependencies... ${modulePack.devDeps.join(" ")}...`);
                yield execProm(`npm i ${modulePack.devDeps.join(" ")} --save-dev`);
            }
            (0, kleur_cols_1.debug)("Running extra setup steps...");
            yield modulePack.extraSetup(lang);
        }
        else {
            (0, kleur_cols_1.warn)(`The module "${currModule}" could not be found.`);
        }
    }
    (0, kleur_cols_1.success)("Project set up successfully.");
});
exports.run = run;
exports.info = {
    name: "build",
    description: "Build a new project. If no modules are provided, it will fall back to the defaults. Modules can be chained.",
    usage: "build [modulePack]",
};
exports.default = { run: exports.run, info: exports.info };
