import { initCircuit, readInputMap } from "./utils.js";
import { InputMap } from "@noir-lang/noir_js";
import { Field } from "@noir-lang/noirc_abi";
import assert from "assert";

const packageName = "poseidon";
const poseidon = await initCircuit(packageName);

const poseidonInputs = await readInputMap(packageName);

let { witness: poseidonWitness } = await poseidon.noir.execute(poseidonInputs);

console.time("poseidon.bb.generateIntermediateProof");
const poseidonProof = await poseidon.bb.generateIntermediateProof(poseidonWitness);
console.timeEnd("poseidon.bb.generateIntermediateProof");

console.time("poseidon.bb.verifyIntermediateProof");
const poseidonProofVerification = await poseidon.bb.verifyIntermediateProof(poseidonProof);
assert(poseidonProofVerification, "Poseidon proof verification failed");
console.timeEnd("poseidon.bb.verifyIntermediateProof");

console.time("poseidon.bb.generateIntermediateProofArtifacts");
const numPublicInputs = 1;
const { proofAsFields, vkAsFields, vkHash } = await poseidon.bb.generateIntermediateProofArtifacts(
  poseidonProof,
  numPublicInputs,
);
console.timeEnd("poseidon.bb.generateIntermediateProofArtifacts");

await poseidon.noir.destroy();

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
