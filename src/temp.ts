import { initCircuit, readInputMap, readProof, readWitnessMap } from "./utils.js";
import { InputMap } from "@noir-lang/noir_js";
import { Field } from "@noir-lang/noirc_abi";
import assert from "assert";

const packageName = "poseidon";
console.time("initCircuit for poseidon");
const poseidon = await initCircuit(packageName);
console.timeEnd("initCircuit for poseidon");

console.time("readInputMap for poseidon");
const poseidonInputs = await readInputMap(packageName);
console.timeEnd("readInputMap for poseidon");

console.time("poseidon.noir.execute");
let { witness: poseidonWitness } = await poseidon.noir.execute(poseidonInputs);
console.timeEnd("poseidon.noir.execute");

console.time("poseidon.bb.generateIntermediateProof");
const poseidonProof = await poseidon.bb.generateIntermediateProof(poseidonWitness);
console.timeEnd("poseidon.bb.generateIntermediateProof");

console.time("poseidon.bb.verifyIntermediateProof");
const poseidonProofVerification = await poseidon.bb.verifyIntermediateProof(poseidonProof);
console.timeEnd("poseidon.bb.verifyIntermediateProof");

assert(poseidonProofVerification, "Poseidon proof verification failed");

console.time("generateIntermediateProofArtifacts");
const numPublicInputs = 1;
const { proofAsFields, vkAsFields, vkHash } = await poseidon.bb.generateIntermediateProofArtifacts(
  poseidonProof,
  numPublicInputs,
);
console.timeEnd("generateIntermediateProofArtifacts");

console.time("poseidon.noir.destroy");
await poseidon.noir.destroy();
console.timeEnd("poseidon.noir.destroy");

// RECURSIVE PROOF
console.time("initCircuit for recursive_poseidon");
const recursivePoseidon = await initCircuit("recursive_poseidon");
console.timeEnd("initCircuit for recursive_poseidon");

console.time("recursivePoseidon.noir.execute");
const recursionInputs: InputMap = {
  verification_key: vkAsFields,
  proof: proofAsFields,
  public_inputs: [(await readInputMap(packageName)).x as Field],
  key_hash: vkHash,
};
const { witness: recursivePoseidonWitness } = await recursivePoseidon.noir.execute(recursionInputs);
console.timeEnd("recursivePoseidon.noir.execute");

console.time("recursivePoseidon.bb.generateFinalProof");
const recursivePoseidonProof = await recursivePoseidon.bb.generateFinalProof(recursivePoseidonWitness);
console.timeEnd("recursivePoseidon.bb.generateFinalProof");

console.time("recursivePoseidon.bb.verifyFinalProof");
const recursivePoseidonProofVerification = await recursivePoseidon.bb.verifyFinalProof(recursivePoseidonProof);
console.timeEnd("recursivePoseidon.bb.verifyFinalProof");
assert(recursivePoseidonProofVerification, "Recursive Poseidon proof verification failed");

console.time("recursivePoseidon.noir.destroy");
await recursivePoseidon.noir.destroy();
console.timeEnd("recursivePoseidon.noir.destroy");
