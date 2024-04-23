import { initCircuit, readInputMap } from "./utils.js";
import { InputMap } from "@noir-lang/noir_js";
import { Field } from "@noir-lang/noirc_abi";
import assert from "assert";
import { prepareIntermediateProofArtifacts } from "./recursive_utils.js";

const packageName = "keccak";
const lhsProof = await prepareIntermediateProofArtifacts(packageName);
const rhsProof = await prepareIntermediateProofArtifacts(packageName);

// RECURSIVE PROOF
const recursive2x = await initCircuit("recursive_2x");
const lhsPublicInputs = [(await readInputMap(packageName)).x as Field];
const rhsPublicInputs = [(await readInputMap(packageName)).x as Field];
const lhsRecursionInputs: InputMap = {
  verification_key: lhsProof.vkAsFields,
  proof: lhsProof.proofAsFields,
  public_inputs: lhsPublicInputs,
  key_hash: lhsProof.vkHash,
};
const rhsRecursionInputs: InputMap = {
  verification_key: rhsProof.vkAsFields,
  proof: rhsProof.proofAsFields,
  public_inputs: rhsPublicInputs,
  key_hash: rhsProof.vkHash,
};

const publicInputs = {
  lhs_proof: lhsRecursionInputs,
  rhs_proof: rhsRecursionInputs,
};
const { witness } = await recursive2x.noir.execute(publicInputs);

console.time("recursive2x.bb.generateFinalProof");
const proof = await recursive2x.bb.generateProof(witness);
console.timeEnd("recursive2x.bb.generateFinalProof");

console.time("recursive2x.bb.verifyFinalProof");
const proofVerification = await recursive2x.bb.verifyProof(proof);
assert(proofVerification, "Recursive2x Poseidon proof verification failed");
console.timeEnd("recursive2x.bb.verifyFinalProof");

await recursive2x.noir.destroy();
