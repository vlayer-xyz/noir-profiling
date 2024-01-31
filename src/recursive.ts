import { initCircuit, readInputMap } from "./utils.js";
import { Field, type InputMap } from "@noir-lang/noirc_abi";
import assert from "assert";
import { prepareIntermediateProofArtefacts } from "./recursive_utils.js";

const packageName = "poseidon";
const { vkAsFields, proofAsFields, vkHash } = await prepareIntermediateProofArtefacts(packageName);

// RECURSIVE PROOF
const recursive = await initCircuit("recursive");
const recursionInputs: InputMap = {
  verification_key: vkAsFields,
  proof: proofAsFields,
  public_inputs: [(await readInputMap(packageName)).x as Field],
  key_hash: vkHash,
};
const { witness: recursiveWitness } = await recursive.noir.execute(recursionInputs);

console.time("recursive.bb.generateFinalProof");
const recursiveProof = await recursive.bb.generateFinalProof(recursiveWitness);
console.timeEnd("recursive.bb.generateFinalProof");

console.time("recursive.bb.verifyFinalProof");
const recursiveProofVerification = await recursive.bb.verifyFinalProof(recursiveProof);
assert(recursiveProofVerification, "Recursive Poseidon proof verification failed");
console.timeEnd("recursive.bb.verifyFinalProof");

await recursive.noir.destroy();
