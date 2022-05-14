export type CommandHandler = (args: string[]) => void;

export type CommandInfo = {
  name: string,
  description: string,
  usage: string
};

export type Command = {
  run: CommandHandler,
  info: CommandInfo
};

export type ModPack = {
  deps: string[],
  devDeps: string[],
  extraSetup: (lang: string) => Promise<void>
};