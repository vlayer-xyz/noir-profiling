import fs from "fs/promises";
import { Expression, Equation, parse } from "algebra.js";
import assert from "assert";

export async function printGates(packageName: string) {
  const circuitPath = `./target/${packageName}.circuit`;
  let data = (await fs.readFile(circuitPath, "utf-8")).trim();
  let lines = data.split("\n");
  let wiresData = lines[0];
  let wires = parseWires(wiresData);
  let gatesData = lines.splice(1, lines.length - 2).join("");
  let gates = parseGates(gatesData);

  const witnessPath = `./target/${packageName}.witness`;
  data = (await fs.readFile(witnessPath, "utf-8")).trim();
  const witness = parseWitness(data);

  printCircuit(wires, gates, witness);
}

function parseWires(input: string) {
  return input
    .substring(4, input.length - 4)
    .split("] [")
    .map((x) => {
      return x
        .trim()
        .split(" ")
        .map((x) => parseInt(x, 16));
    });
}

function parseGates(input: string) {
  return input
    .substring(4, input.length - 4)
    .split("] [")
    .map((x) => {
      return x
        .trim()
        .split(" ")
        .map((x) => BigInt(x).valueOf());
    });
}

function parseWitness(input: string) {
  const lines = input.split("\n");
  return lines.splice(1, lines.length - 2).map((x) => BigInt(x.trim()).valueOf());
}

function printCircuit(wires: number[][], gates: bigint[][], witness: bigint[]) {
  const SELECTOR_COUNT = 11;
  const SELECTOR_NAMES = [
    "q_m",
    "q_c",
    "q_Left",
    "q_Right",
    "q_Output",
    "q_4",
    "q_arith",
    "q_sort",
    "q_elliptic",
    "q_aux",
    "table_type",
  ];
  let count = wires[0].length;

  console.log(witness.map(fieldToInt));
  for (let i = 1; i < count; i++) {
    let gateWires = [wires[0][i], wires[1][i], wires[2][i], wires[3][i]];
    let gatePoly = new Expression();
    for (let selector_idx = 0; selector_idx < SELECTOR_COUNT; selector_idx++) {
      let selectorName = SELECTOR_NAMES[selector_idx];
      let coefficient = fieldToInt(gates[selector_idx][i]);

      // if (selectorName == "q_arith") {
      //   // assert(gates[selector_idx][i] == 1n);
      //   continue;
      // }
      let resolvedSelector = resolveSelector(selectorName, gateWires);
      let mulTerm = resolvedSelector.multiply(coefficient);
      // console.log(mulTerm.toString());
      gatePoly = gatePoly.add(mulTerm.simplify());
    }
    let gate = new Equation(gatePoly.simplify(), 0).toString();
    let gateWithWitnessSubstitutions = gate;
    for (let witness_index = 0; witness_index < witness.length; witness_index++) {
      gateWithWitnessSubstitutions = gateWithWitnessSubstitutions.replace(
        new RegExp(`W\\[${witness_index}\\]`, "g"),
        witness[witness_index].toString(),
      );
    }
    console.log(`Gate ${i}:  ${gate}`);
    // console.log(`         ${gateWithWitnessSubstitutions}`);
  }
}

function fieldToInt(selector: bigint) {
  if (selector < 2n ** 32n) {
    return Number(selector);
  } else if (selector == 21888242871839275222246405745257275088548364400416034343698204186575808495616n) {
    return -1;
  } else if (selector == 21888242871839275222246405745257275088548364400416034343698204186575808495615n) {
    return -2;
  } else if (21888242871839275222246405745257275088548364400416034343698204186575808495617n - selector < 2n ** 32n) {
    return Number(selector - 21888242871839275222246405745257275088548364400416034343698204186575808495617n);
  } else {
    throw new Error(`Unknown selector value: ${selector}`);
  }
}

function resolveSelector(selectorName: string, wires: number[]) {
  if (selectorName == "q_m") {
    return new Expression(`W[${wires[0]}]`).multiply(new Expression(`W[${wires[1]}]`));
  } else if (selectorName == "q_c") {
    return new Expression(1);
  } else if (selectorName == "q_Left") {
    return new Expression(`W[${wires[0]}]`);
  } else if (selectorName == "q_Right") {
    return new Expression(`W[${wires[1]}]`);
  } else if (selectorName == "q_Output") {
    return new Expression(`W[${wires[2]}]`);
  } else {
    return new Expression(selectorName);
  }
}
