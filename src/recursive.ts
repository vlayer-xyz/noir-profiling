import { encodePublicInputs, initCircuit, readCircuit } from "./utils.js";
import { type InputMap } from "@noir-lang/noirc_abi";
import assert from "assert";
import { prepareIntermediateProofArtifacts, prepareIntermediateProofArtifactsUsingNargo } from "./recursive_utils.js";

const packageName = "keccak";
const keccakCircuit = await readCircuit(packageName);
const { vkAsFields, proofAsFields, vkHash } = await prepareIntermediateProofArtifactsUsingNargo(packageName);

const publicInputs = await encodePublicInputs(packageName, keccakCircuit.abi);

// // RECURSIVE PROOF
const recursive = await initCircuit("recursive");
const recursionInputs: InputMap = {
  verification_key: vkAsFields,
  proof: proofAsFields,
  public_inputs: publicInputs,
  key_hash: vkHash,
};
const { witness: recursiveWitness } = await recursive.noir.execute(recursionInputs);

console.time("recursive.bb.generateFinalProof");
const recursiveProof = await recursive.bb.generateProof(recursiveWitness);
console.timeEnd("recursive.bb.generateFinalProof");

console.time("recursive.bb.verifyFinalProof");
const recursiveProofVerification = await recursive.bb.verifyProof(recursiveProof);
assert(recursiveProofVerification, `Recursive ${packageName} proof verification failed`);
console.timeEnd("recursive.bb.verifyFinalProof");

await recursive.noir.destroy();
