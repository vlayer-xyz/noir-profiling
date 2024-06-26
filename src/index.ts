import { readAllInputs, readProof, readWitnessMap, initCircuit } from "./utils.js";
import assert from "assert";
import { Action, argv } from "./cli.js";

const { noir, circuit } = await initCircuit(argv.package);

if (argv.action == Action.Verify) {
  let proof = await readProof(argv.package);
  let witnessMap = await readWitnessMap(argv.package, circuit.abi);
  const proofData = {
    proof,
    publicInputs: Array.from(witnessMap.values()),
  };
  let isCorrect = await noir.verifyProof(proofData);
  assert(isCorrect, "Proof verification failed");
} else if (argv.action == Action.Prove) {
  let inputMap = await readAllInputs(argv.package);
  await noir.generateProof(inputMap);
}

await noir.destroy();
