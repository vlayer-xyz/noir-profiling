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

console.time("generateIntermediateProofArtifacts");
const numPublicInputs = 1;
const { proofAsFields, vkAsFields, vkHash } = await poseidon.bb.generateIntermediateProofArtifacts(
  poseidonProof,
  numPublicInputs,
);
console.timeEnd("generateIntermediateProofArtifacts");

await poseidon.noir.destroy();

// RECURSIVE PROOF
const recursivePoseidon = await initCircuit("recursive_poseidon");
const recursionInputs: InputMap = {
  verification_key: vkAsFields,
  proof: proofAsFields,
  public_inputs: [(await readInputMap(packageName)).x as Field],
  key_hash: vkHash,
};
const { witness: recursivePoseidonWitness } = await recursivePoseidon.noir.execute(recursionInputs);

console.time("recursivePoseidon.bb.generateFinalProof");
const recursivePoseidonProof = await recursivePoseidon.bb.generateFinalProof(recursivePoseidonWitness);
console.timeEnd("recursivePoseidon.bb.generateFinalProof");

console.time("recursivePoseidon.bb.verifyFinalProof");
const recursivePoseidonProofVerification = await recursivePoseidon.bb.verifyFinalProof(recursivePoseidonProof);
assert(recursivePoseidonProofVerification, "Recursive Poseidon proof verification failed");
console.timeEnd("recursivePoseidon.bb.verifyFinalProof");

await recursivePoseidon.noir.destroy();
