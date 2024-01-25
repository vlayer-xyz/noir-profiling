import { CompiledCircuit, WitnessMap } from "@noir-lang/noir_js";
import { promises as fs } from "fs";
import toml from "toml";

import { Abi, abiEncode, type InputMap } from "@noir-lang/noirc_abi";

export async function readCircuit(
  packageName: string,
): Promise<CompiledCircuit> {
  const CIRCUIT_PATH = `./target/${packageName}.json`;
  const data = await fs.readFile(CIRCUIT_PATH, "utf8");
  return JSON.parse(data);
}

export async function readProof(path: string): Promise<Uint8Array> {
  const proofHex = await fs.readFile(path, "utf-8");
  return encodeHexString("0x" + proofHex);
}

export async function readWitnessMap(
  path: string,
  abi: Abi,
): Promise<WitnessMap> {
  const inputMap = await readInputMap(path);
  const witnessMap = abiEncode(abi, inputMap, inputMap["return"]);
  return witnessMap;
}

export async function readInputMap(path: string): Promise<InputMap> {
  const verifierData = await fs.readFile(path, "utf-8");
  const inputMap = toml.parse(verifierData);
  return inputMap;
}

export function encodeHexString(value: string): Uint8Array {
  if (!isHex(value)) {
    throw new Error(`Invalid hexstring: ${value}`);
  }
  const arr = [];
  for (let i = 2; i < value.length; i += 2) {
    arr.push(parseInt(value.substr(i, 2), 16));
  }
  return new Uint8Array(arr);
}

export type Hex = `0x${string}`;

export function isHex(
  value: unknown,
  { strict = true }: { strict?: boolean } = {},
): value is Hex {
  if (!value) return false;
  if (typeof value !== "string") return false;
  return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith("0x");
}
