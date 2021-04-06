declare module 'conventional-commit-types' {
  export type TypeMap = Record<string, { title: string, description: string }>
  const types: { types: TypeMap; };
  export = types;

}

declare module 'longest' {
  function longest(strs: string[]): string

  export = longest;
}


declare module 'commitizen' {

  export const configLoader: { load(): any }

}

declare module 'gitconfig' {
  interface GitConfig {
    user: { name: string, email: string; },
  }

  const config: { get(options: Record<string, string>): Promise<GitConfig>; };
  export = config
}

declare module 'inquirer' {
  export interface Answer {
    type: string,
    body: string,
    issue: string
  }

  export interface Inquirer {
    prompt(any): Promise<Answer>
    registerPrompt(pluginName: string, module: any): void;
  }
}
