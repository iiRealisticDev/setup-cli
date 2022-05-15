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
// The TSConfig template to use for all project setups
const tsConfigTemplate = `
{
  "compilerOptions": {
    "target": "es2016",
    "module": "CommonJS",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "resolveJsonModule": true,
    "charset": "utf8"
  },
  "include": ["./src"]
}`;
const run = (args) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const lang = (_a = args[0]) !== null && _a !== void 0 ? _a : "ts";
    const cwd = process.cwd(); // Used for making files
    if (!["ts", "js"].includes(lang)) { // only accept ts or js as a language
        (0, kleur_cols_1.err)("Invalid language. Only js and ts are supported.");
        process.exit(0);
    }
    const modules = (_b = args[1]) !== null && _b !== void 0 ? _b : "bot"; // The modules to build, default is bot
    (0, kleur_cols_1.debug)("Building...");
    yield execProm("npm init -y");
    if (lang == "ts") {
        /*
        Sets up the environment for JS usage
        Makes a tsconfig file and sets the content to the template
        Installs node types, makes the src directory, dist directory, and the index.ts file instead of ./src/
        Outputs a message
        */
        (0, kleur_cols_1.debug)("Setting up environment for TypeScript...");
        yield promises_1.default.writeFile("./tsconfig.json", tsConfigTemplate);
        yield execProm(`npm i --save-dev @types/node && mkdir src && mkdir dist && echo console.log("Hello World"); > ${cwd}/src/index.ts`);
        (0, kleur_cols_1.success)("Setup environment for TypeScript successfully.");
    }
    else if (lang == "js") {
        /*
        Sets up the environment for JS usage
        Makes a index.js file in ./src/
        Outputs a message
        */
        (0, kleur_cols_1.debug)("Setting up environment for JavaScript...");
        yield execProm("echo console.log(\"Hello World\"); > src/index.js");
        (0, kleur_cols_1.success)("Setup environment for JavaScript successfully.");
    }
    // Checks if the module pack exists, if it does it'll install the deps, devDeps and then run the extra setup steps. 
    const modulePack = modulePacks_1.default[modules];
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
        (0, kleur_cols_1.warn)(`The module "${modules}" could not be found.`);
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
