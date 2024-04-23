import { execSync } from "child_process";
import { withProfiling } from "./utils.js";
import { readFile, rm, writeFile } from "fs/promises";

async function getBackendBinaryPath(): Promise<string> {
  const currentBackend = execSync("nargo backend current").toString().trim();
  const backendPath = `~/.nargo/backends/${currentBackend}/backend_binary`;
  return backendPath;
}

export class BarretenbergBinaryWrapper {
  public vkPath: string;
  public vkAsFieldsPath: string;
  public proofWithInputsPath: string;
  public proofAsFieldsPath: string;

  private constructor(
    private path: string,
    public packageName: string,
  ) {
    this.vkPath = `./target/${packageName}.vk`;
    this.vkAsFieldsPath = `./target/${packageName}.vk_fields`;
    this.proofWithInputsPath = `./proofs/${packageName}.proof_with_inputs`;
    this.proofAsFieldsPath = `./target/${packageName}.proof_fields`;
  }

  static async create(packageName: string): Promise<BarretenbergBinaryWrapper> {
    const path = await getBackendBinaryPath();
    return new BarretenbergBinaryWrapper(path, packageName);
  }

  async writeVk(acirPath: string): Promise<void> {
    await withProfiling(`${this.packageName}.bb.write_vk`, async () => {
      execSync(`${this.path} write_vk -b ${acirPath} -o ${this.vkPath}`);
    });
  }

  async vkAsFields(): Promise<void> {
    await withProfiling(`${this.packageName}.bb.vk_as_fields`, async () => {
      execSync(`${this.path} vk_as_fields -k ${this.vkPath} -o ${this.vkAsFieldsPath}`);
    });
  }

  async proofAsFields(): Promise<void> {
    await withProfiling(`${this.packageName}.bb.proof_as_fields`, async () => {
      execSync(
        `${this.path} proof_as_fields -k ${this.vkPath} -p ${this.proofWithInputsPath} -o ${this.proofAsFieldsPath}`,
      );
    });
  }
}

interface Vk {
  vkHash: string;
  vkAsFields: string[];
}

export class BarretenbergBackend {
  constructor(private bb: BarretenbergBinaryWrapper) {}
  public async create(packageName: string): Promise<BarretenbergBackend> {
    const bb = await BarretenbergBinaryWrapper.create(packageName);
    return new BarretenbergBackend(bb);
  }

  public async getVk(bytecode: string): Promise<Vk> {
    const acirPath = `./target/${this.bb.packageName}.acir`;
    await writeFile(acirPath, Buffer.from(bytecode, "base64"));

    await this.bb.writeVk(acirPath);
    await this.bb.vkAsFields();

    const [vkHash, ...vkAsFields] = JSON.parse(await readFile(this.bb.vkAsFieldsPath, "utf8"));

    await rm(acirPath);

    return { vkHash, vkAsFields };
  }
}
