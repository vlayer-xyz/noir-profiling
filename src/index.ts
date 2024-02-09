import { readInputMap, readProof, readWitnessMap, initCircuit } from "./utils.js";
import assert from "assert";
import { Action, argv } from "./cli.js";
import { printGates } from "./circuit.js";

const { noir, circuit } = await initCircuit(argv.package);

if (argv.action == Action.Verify) {
  let proof = await readProof(argv.package);
  let witnessMap = await readWitnessMap(argv.package, circuit.abi);
  const proofData = {
    proof,
    publicInputs: Array.from(witnessMap.values()),
  };
  let isCorrect = await noir.verifyFinalProof(proofData);
  assert(isCorrect, "Proof verification failed");
} else if (argv.action == Action.Prove) {
  let inputMap = await readInputMap(argv.package);
  await noir.generateFinalProof(inputMap);
} else if (argv.action == Action.Gates) {
  await printGates(argv.package);
}

await noir.destroy();
