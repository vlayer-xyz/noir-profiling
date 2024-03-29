# noir-profiling

## Working on this project

You can print the number of opcodes in all circuits:

```
nargo info --workspace
```

Or regenerate profiling info:

```
./profile.sh
```

## Results

### Profiling results (local M1 Max)

| Package   | Tool    | Action | Elapsed Time | User Time | System Time | CPU Usage | Max Memory |
| --------- | ------- | ------ | ------------ | --------- | ----------- | --------- | ---------- |
| poseidon  | nargo   | prove  | 0:00.65      | 1.13      | 0.19        | 201%      | 148.89MB   |
|           |         | verify | 0:00.59      | 0.85      | 0.14        | 167%      | 143.26MB   |
|           | noir_js | prove  | 0:01.40      | 3.61      | 0.67        | 304%      | 2.14GB     |
|           |         | verify | 0:01.30      | 3.37      | 0.59        | 303%      | 2.04GB     |
| rlp       | nargo   | prove  | 0:01.28      | 3.65      | 0.28        | 307%      | 308.08MB   |
|           |         | verify | 0:01.17      | 3.56      | 0.16        | 317%      | 245.10MB   |
|           | noir_js | prove  | 0:02.51      | 9.74      | 0.76        | 417%      | 2.37GB     |
|           |         | verify | 0:02.28      | 9.09      | 0.62        | 426%      | 2.20GB     |
| keccak    | nargo   | prove  | 0:04.11      | 20.72     | 0.66        | 519%      | 1.18GB     |
|           |         | verify | 0:04.36      | 21.54     | 0.50        | 505%      | 983.63MB   |
|           | noir_js | prove  | 0:11.49      | 55.73     | 1.33        | 496%      | 3.04GB     |
|           |         | verify | 0:09.69      | 51.34     | 0.80        | 537%      | 2.74GB     |
| keccak_2x | nargo   | prove  | 0:07.84      | 40.64     | 1.05        | 531%      | 2.21GB     |
|           |         | verify | 0:06.79      | 40.07     | 0.75        | 601%      | 1.82GB     |
|           | noir_js | prove  | 0:21.25      | 106.92    | 1.92        | 512%      | 4.03GB     |
|           |         | verify | 0:17.76      | 95.39     | 1.07        | 543%      | 3.71GB     |

### Recursive proofs (WASM, local M1 Max)

#### Verifying single poseidon proof

```sh
poseidon.bb.generateIntermediateProof: 1.447s
poseidon.bb.verifyIntermediateProof: 239.36ms
poseidon.bb.generateIntermediateProofArtifacts: 201.236ms
recursive.bb.generateFinalProof: 24.827s
recursive.bb.verifyFinalProof: 7.995s
```

#### Verifying two keccak proofs

```
keccak.bb.generateIntermediateProof: 21.437s
keccak.bb.verifyIntermediateProof: 7.665s
keccak.bb.generateIntermediateProofArtifacts: 7.642s
keccak.bb.generateIntermediateProof: 19.652s
keccak.bb.verifyIntermediateProof: 7.607s
keccak.bb.generateIntermediateProofArtifacts: 7.643s
recursive2x.bb.generateFinalProof: 48.134s
recursive2x.bb.verifyFinalProof: 14.451s
```

### Circuit sizes

```
+--------------+----------------------+--------------+----------------------+
| Package      | Expression Width     | ACIR Opcodes | Backend Circuit Size |
+--------------+----------------------+--------------+----------------------+
| poseidon     | Bounded { width: 3 } | 573          | 579                  |
+--------------+----------------------+--------------+----------------------+
| rlp          | Bounded { width: 3 } | 4188         | 11704                |
+--------------+----------------------+--------------+----------------------+
| keccak       | Bounded { width: 3 } | 4            | 97766                |
+--------------+----------------------+--------------+----------------------+
| keccak_2x    | Bounded { width: 3 } | 7            | 154910               |
+--------------+----------------------+--------------+----------------------+
| recursive    | Bounded { width: 3 } | 1            | 247869               |
+--------------+----------------------+--------------+----------------------+
| recursive_2x | Bounded { width: 3 } | 2            | 500966               |
+--------------+----------------------+--------------+----------------------+
```

### Halo2 keccak benchmark
Every row represents one execution of Keccak prove and verify algorithm implemented 
in [packed_multi_keccak_prover](https://github.com/vlayer-xyz/halo2-lib/blob/keccak-benchmark/hashes/zkevm/src/keccak/vanilla/tests.rs#L262) test for given circuit degree, rows per round and input bytes.

Generated using 
```
RUST_TEST_THREADS=1 cargo test -- --nocapture packed_multi_keccak_prover 2>/dev/null | grep "| "
```
 in https://github.com/vlayer-xyz/halo2-lib/tree/keccak-benchmark. 

| Circuit Degree | Rows Per Round | Input Bytes | Prove Time | Verify Time |
|----------------|----------------|-------------|------------|-------------| 
| 9              | 9              | 0           | 3.02s      | 54.42ms     |
| 10             | 9              | 0           | 3.39s      | 42.85ms     |
| 11             | 9              | 0           | 7.37s      | 42.97ms     |
| 11             | 25             | 0           | 2.61s      | 68.12ms     |
| 12             | 25             | 0           | 3.57s      | 57.75ms     |
| 13             | 25             | 0           | 6.29s      | 57.14ms     |
| 11             | 9              | 532         | 5.76s      | 42.88ms     |
| 12             | 9              | 532         | 8.88s      | 39.22ms     |
| 12             | 25             | 532         | 3.72s      | 57.90ms     |
| 13             | 25             | 532         | 9.83s      | 57.21ms     |
| 15             | 9              | 10000       | 51.59s     | 48.76ms     |
| 16             | 25             | 10000       | 43.00s     | 56.01ms     |
