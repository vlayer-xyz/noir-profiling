import { CompiledCircuit, Noir, WitnessMap } from "@noir-lang/noir_js";
import { promises as fs } from "fs";
import toml from "toml";
import os from "os";

import { Abi, abiEncode, type InputMap } from "@noir-lang/noirc_abi";
import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";

interface CircuitData {
  noir: Noir;
  bb: BarretenbergBackend;
  circuit: CompiledCircuit;
}

export async function initCircuit(packageName: string): Promise<CircuitData> {
  const circuit = await readCircuit(packageName);
  const bb = new BarretenbergBackend(circuit, {
    threads: os.cpus().length,
  });
  const noir = new Noir(circuit, bb);

  return {
    noir,
    circuit,
    bb,
  };
}

export async function readCircuit(packageName: string): Promise<CompiledCircuit> {
  const CIRCUIT_PATH = `./target/${packageName}.json`;
  const data = await fs.readFile(CIRCUIT_PATH, "utf8");
  return JSON.parse(data);
}

export async function readProof(packageName: string): Promise<Uint8Array> {
  const PROOF_PATH = `./proofs/${packageName}.proof`;
  const proofHex = await fs.readFile(PROOF_PATH, "utf-8");
  return encodeHexString("0x" + proofHex);
}

export async function readWitnessMap(packageName: string, abi: Abi): Promise<WitnessMap> {
  const inputMap = await readInputMap(packageName);
  const witnessMap = abiEncode(abi, inputMap, inputMap["return"]);
  return witnessMap;
}

export async function readInputMap(packageName: string): Promise<InputMap> {
  const PROVER_MAP_PATH = `./circuits/${packageName}/Prover.toml`;
  const verifierData = await fs.readFile(PROVER_MAP_PATH, "utf-8");
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

export function isHex(value: unknown, { strict = true }: { strict?: boolean } = {}): value is Hex {
  if (!value) return false;
  if (typeof value !== "string") return false;
  return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith("0x");
}
