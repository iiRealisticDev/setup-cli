import cmds from "./commands/index";

import { err } from "./utils/kleur-cols";

import { Command } from "./utils/types";

const run = () => {
  const args: string[] = process.argv.splice(2);
  const command: string = args[0];
  const cmdExists: Command | undefined = Object.entries(cmds).filter((cmd) => {
    return cmd[1].info.name.toLowerCase() === command.toLowerCase();
  })[0]?.[1];
  if (!cmdExists) return err("Command not found");
  cmdExists.run(args.slice(1));
};

run();
