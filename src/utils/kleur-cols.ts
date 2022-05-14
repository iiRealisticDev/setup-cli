import kleur from "kleur";

export const err = (text: string): void => {
  console.log(kleur.red().bold(text));
};

export const warn = (text: string): void => {
  console.log(kleur.yellow().bold(text));
};

export const info = (text: string): void => {
  console.log(kleur.cyan().bold(text));
};

export const success = (text: string): void => {
  console.log(kleur.green().bold(text));
};

export const debug = (text: string): void => {
  console.log(kleur.magenta().bold(text));
};
