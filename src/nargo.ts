import { execSync } from "child_process";
import { withProfiling } from "./utils.js";

export async function nargoProve(packageName: string): Promise<void> {
  await withProfiling(`${packageName}.nargo.prove`, async () => {
    execSync(`nargo prove --package ${packageName}`);
  });
}
