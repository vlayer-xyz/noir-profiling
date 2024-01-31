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
