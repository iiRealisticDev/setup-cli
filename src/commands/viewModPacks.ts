import { err, info as i } from "../utils/kleur-cols";
import kleur from "kleur";
import { CommandHandler, CommandInfo } from "../utils/types";
import modulePacks from "../utils/modulePacks";

export const run: CommandHandler = async (args: string[]) => {
  const pack = args[0] ?? "all";

  if (pack == "all") {
    const entries = [];
    for (const modulePack of Object.entries(modulePacks)) {
      entries.push(`${kleur.blue(modulePack[0])}\nDependencies: ${kleur.magenta(modulePack[1].deps.join(", "))}\nDev Dependencies: ${kleur.yellow(modulePack[1].devDeps.join(", "))}`);
    }
    i(entries.join("\n\n"));
  } else {
    const modpack = modulePacks[pack as keyof typeof modulePacks];
    if (!modpack) return err("No modpack with given name found.");
    i(`${kleur.blue(pack)}:\nDependencies: ${kleur.magenta(modpack.deps.join(", "))}\nDev Dependencies: ${kleur.yellow(modpack.devDeps.join(", "))}`);
  }
};

export const info: CommandInfo = {
  name: "view-mod-packs",
  description: "View module packs.",
  usage: "view-mod-packs [pack]",
};

export default { run, info };
