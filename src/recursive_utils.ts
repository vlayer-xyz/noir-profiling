import assert from "assert";
import { initCircuit, readInputMap } from "./utils.js";

export interface IntermediateProofArtefacts {
  proofAsFields: string[];
  vkAsFields: string[];
  vkHash: string;
}

export async function prepareIntermediateProofArtefacts(packageName: string): Promise<IntermediateProofArtefacts> {
  const { bb, noir } = await initCircuit(packageName);

  const inputs = await readInputMap(packageName);
  let { witness } = await noir.execute(inputs);

  console.time(`${packageName}.bb.generateIntermediateProof`);
  const proof = await bb.generateIntermediateProof(witness);
  console.timeEnd(`${packageName}.bb.generateIntermediateProof`);

  console.time(`${packageName}.bb.verifyIntermediateProof`);
  const proofVerification = await bb.verifyIntermediateProof(proof);
  assert(proofVerification, `Proof verification failed`);
  console.timeEnd(`${packageName}.bb.verifyIntermediateProof`);

  console.time(`${packageName}.bb.generateIntermediateProofArtifacts`);
  const numPublicInputs = 1;
  const intermediateProofArtefacts = await bb.generateIntermediateProofArtifacts(proof, numPublicInputs);
  console.timeEnd(`${packageName}.bb.generateIntermediateProofArtifacts`);

  await noir.destroy();

  return intermediateProofArtefacts;
}
