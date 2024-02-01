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
| poseidon  | nargo   | prove  | 0:00.67      | 1.16      | 0.17        | 198%      | 149.46MB   |
|           |         | verify | 0:00.64      | 0.89      | 0.12        | 159%      | 143.59MB   |
|           | noir_js | prove  | 0:01.62      | 3.67      | 0.66        | 266%      | 2.18GB     |
|           |         | verify | 0:01.28      | 3.30      | 0.55        | 299%      | 2.13GB     |
| rlp       | nargo   | prove  | 0:01.28      | 3.74      | 0.25        | 310%      | 313.48MB   |
|           |         | verify | 0:01.27      | 3.70      | 0.15        | 303%      | 244.93MB   |
|           | noir_js | prove  | 0:02.61      | 9.90      | 0.72        | 406%      | 2.24GB     |
|           |         | verify | 0:02.48      | 9.25      | 0.59        | 396%      | 2.36GB     |
| keccak    | nargo   | prove  | 0:07.41      | 40.26     | 0.96        | 555%      | 2.29GB     |
|           |         | verify | 0:06.62      | 39.98     | 0.62        | 613%      | 1.79GB     |
|           | noir_js | prove  | 0:21.50      | 107.59    | 2.00        | 509%      | 4.07GB     |
|           |         | verify | 0:18.11      | 95.84     | 1.04        | 534%      | 3.65GB     |
| keccak_2x | nargo   | prove  | 0:14.52      | 79.77     | 1.83        | 561%      | 4.31GB     |
|           |         | verify | 0:12.44      | 76.64     | 1.24        | 626%      | 3.57GB     |
|           | noir_js | prove  | 0:42.05      | 213.33    | 3.54        | 515%      | 6.06GB     |
|           |         | verify | 0:32.77      | 184.67    | 1.52        | 568%      | 5.11GB     |

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
| keccak       | Bounded { width: 3 } | 4            | 155014               |
+--------------+----------------------+--------------+----------------------+
| keccak_2x    | Bounded { width: 3 } | 7            | 300406               |
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
