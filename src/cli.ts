import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export enum Action {
  Verify = "verify",
  Prove = "prove",
  Gates = "gates",
}

interface Arguments {
  package: string;
  action: Action;
}

export const argv = yargs(hideBin(process.argv))
  .usage("Usage: $0 --package <string> --action <action>")
  .option("package", {
    describe: "Noir package name",
    type: "string",
    demandOption: true,
  })
  .option("action", {
    describe: "Action to perform",
    type: "string",
    demandOption: true,
    choices: Object.values(Action),
  })
  .help().argv as unknown as Arguments;
