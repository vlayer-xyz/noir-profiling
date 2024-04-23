import { initCircuit, readInputMap } from "./utils.js";
import { Field, type InputMap } from "@noir-lang/noirc_abi";
import assert from "assert";
import { prepareIntermediateProofArtifacts, prepareIntermediateProofArtifactsUsingNargo } from "./recursive_utils.js";

const packageName = "keccak_big";
const { vkAsFields, proofAsFields, vkHash } = await prepareIntermediateProofArtifactsUsingNargo(packageName);

// // RECURSIVE PROOF
const recursive = await initCircuit("recursive");
const recursionInputs: InputMap = {
  verification_key: vkAsFields,
  proof: proofAsFields,
  public_inputs: [(await readInputMap(packageName)).x as Field],
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
