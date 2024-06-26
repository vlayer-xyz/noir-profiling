import assert from "assert";
import {
  encodePublicInputs,
  initCircuit,
  readAllInputs,
  readProofHex,
  readPublicInputs,
  readWitnessMap,
} from "./utils.js";
import { readFile, writeFile } from "fs/promises";
import { Hex, concatHex } from "viem";
import { CompiledCircuit } from "@noir-lang/noir_js";
import { BarretenbergBackend as BarretenbergBackend, BarretenbergBinaryWrapper } from "./bb.js";
import { nargoProve } from "./nargo.js";

export interface IntermediateProofArtifacts {
  proofAsFields: string[];
  vkAsFields: string[];
  vkHash: string;
}

export async function prepareIntermediateProofArtifacts(packageName: string): Promise<IntermediateProofArtifacts> {
  const { bb, noir } = await initCircuit(packageName);

  const inputs = await readAllInputs(packageName);
  let { witness } = await noir.execute(inputs);

  console.time(`${packageName}.bb.generateIntermediateProof`);
  const proof = await bb.generateProof(witness);
  console.timeEnd(`${packageName}.bb.generateIntermediateProof`);

  console.time(`${packageName}.bb.verifyIntermediateProof`);
  const proofVerification = await bb.verifyProof(proof);
  assert(proofVerification, `Proof verification failed`);
  console.timeEnd(`${packageName}.bb.verifyIntermediateProof`);

  console.time(`${packageName}.bb.generateIntermediateProofArtifacts`);
  const numPublicInputs = 32 + 32 + 1;
  const intermediateProofArtifacts = await bb.generateRecursiveProofArtifacts(proof, numPublicInputs);
  console.timeEnd(`${packageName}.bb.generateIntermediateProofArtifacts`);

  await noir.destroy();

  return intermediateProofArtifacts;
}

async function getProofAsFields(
  packageName: string,
  circuit: CompiledCircuit,
  bb: BarretenbergBinaryWrapper,
): Promise<string[]> {
  const proofHex = await readProofHex(packageName);

  const publicInputs = await encodePublicInputs(packageName, circuit.abi);
  const publicInputsHex = concatHex(publicInputs);

  const proofWithInputsHex = concatHex([publicInputsHex, proofHex]);

  await writeFile(bb.proofWithInputsPath, proofWithInputsHex.substring(2), "hex");

  await bb.proofAsFields();

  const proofAsFieldsWithInputs = JSON.parse(await readFile(bb.proofAsFieldsPath, "utf8"));
  return proofAsFieldsWithInputs.slice(publicInputs.length);
}

export async function prepareIntermediateProofArtifactsUsingNargo(
  packageName: string,
): Promise<IntermediateProofArtifacts> {
  const { circuit } = await initCircuit(packageName);

  const bb = await BarretenbergBinaryWrapper.create(packageName);
  const bbb = new BarretenbergBackend(bb);

  const { vkHash, vkAsFields } = await bbb.getVk(circuit.bytecode);

  await nargoProve(packageName);

  const proofAsFields = await getProofAsFields(packageName, circuit, bb);

  return {
    proofAsFields,
    vkAsFields,
    vkHash,
  };
}
