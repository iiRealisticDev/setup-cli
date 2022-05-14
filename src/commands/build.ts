import { exec } from "child_process";
import utils from "node:util";
const execProm = utils.promisify(exec);
import { debug, err, warn, success } from "../utils/kleur-cols";
import { CommandHandler, CommandInfo } from "../utils/types";
import fs from "fs/promises";
import modulePacks from "../utils/modulePacks";

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

export const run: CommandHandler = async (args: string[]) => {
  const lang: string = args[0] ?? "ts";
  const cwd: string = process.cwd(); // Used for making files
  if (!["ts", "js"].includes(lang)) { // only accept ts or js as a language
    err("Invalid language. Only js and ts are supported.");
    process.exit(0);
  }
  const modules: string = args[1] ?? "bot"; // The modules to build, default is bot
  debug("Building...");
  await execProm("npm init -y");
  if (lang == "ts") {
    /*
    Sets up the environment for JS usage
    Makes a tsconfig file and sets the content to the template
    Installs node types, makes the src directory, dist directory, and the index.ts file instead of ./src/
    Outputs a message
    */
    debug("Setting up environment for TypeScript...");
    await fs.writeFile("./tsconfig.json", tsConfigTemplate);
    await execProm(`npm i --save-dev @types/node && mkdir src && mkdir dist && echo console.log("Hello World"); > ${cwd}/src/index.ts`);
    success("Setup environment for TypeScript successfully.");
  } else if (lang == "js") {
    /*
    Sets up the environment for JS usage
    Makes a index.js file in ./src/
    Outputs a message
    */
    debug("Setting up environment for JavaScript...");
    await execProm("echo console.log(\"Hello World\"); > src/index.js");
    success("Setup environment for JavaScript successfully.");
  }
  // Checks if the module pack exists, if it does it'll install the deps, devDeps and then run the extra setup steps. 
  const modulePack = modulePacks[modules as keyof typeof modulePacks];
  if (modulePack) {
    if (modulePack.deps) {
      debug(`Installing dependencies... ${modulePack.deps.join(" ")}...`);
      await execProm(`npm i ${modulePack.deps.join(" ")}`);
    }
    if (modulePack.devDeps) {
      debug(`Installing dev dependencies... ${modulePack.devDeps.join(" ")}...`);
      await execProm(`npm i ${modulePack.devDeps.join(" ")} --save-dev`);
    }
    debug("Running extra setup steps...");
    await modulePack.extraSetup(lang);
  } else {
    warn(`The module "${modules}" could not be found.`);
  }
  success("Project set up successfully.");
};

export const info: CommandInfo = {
  name: "build",
  description: "Build a new project. If no modules are provided, it will fall back to the defaults. Modules can be chained.",
  usage: "build [modulePack]",
};

export default { run, info };