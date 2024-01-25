import {
  readInputMap,
  readProof,
  readWitnessMap,
  readCircuit,
} from "./utils.js";
import assert from "assert";
import os from "os";
import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
import { Noir } from "@noir-lang/noir_js";
import { Action, argv } from "./cli.js";

const PROOF_PATH = `./proofs/${argv.package}.proof`;
const VERIFIER_MAP_PATH = `./circuits/${argv.package}/Verifier.toml`;
const PROVER_MAP_PATH = `./circuits/${argv.package}/Prover.toml`;

const circuit = await readCircuit(argv.package);
const backend = new BarretenbergBackend(circuit, {
  threads: os.cpus().length,
});
const noir = new Noir(circuit, backend);

if (argv.action == Action.Verify) {
  let proof = await readProof(PROOF_PATH);
  let witnessMap = await readWitnessMap(VERIFIER_MAP_PATH, circuit.abi);
  const proofData = {
    proof,
    publicInputs: Array.from(witnessMap.values()),
  };
  let isCorrect = await noir.verifyFinalProof(proofData);
  assert(isCorrect, "Proof vefification failed");
} else if (argv.action == Action.Prove) {
  let inputMap = await readInputMap(PROVER_MAP_PATH);
  await noir.generateFinalProof(inputMap);
}

await noir.destroy();
