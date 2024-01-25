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

| Package   | Tool  | Action | Elapsed Time | User Time | System Time | CPU Usage | Max Memory |
| --------- | ----- | ------ | ------------ | --------- | ----------- | --------- | ---------- |
| poseidon  | nargo | prove  | 0:00.67      | 1.16      | 0.17        | 198%      | 149.46MB   |
|           |       | verify | 0:00.64      | 0.89      | 0.12        | 159%      | 143.59MB   |
|           | yarn  | prove  | 0:01.62      | 3.67      | 0.66        | 266%      | 2.18GB     |
|           |       | verify | 0:01.28      | 3.30      | 0.55        | 299%      | 2.13GB     |
| rlp       | nargo | prove  | 0:01.28      | 3.74      | 0.25        | 310%      | 313.48MB   |
|           |       | verify | 0:01.27      | 3.70      | 0.15        | 303%      | 244.93MB   |
|           | yarn  | prove  | 0:02.61      | 9.90      | 0.72        | 406%      | 2.24GB     |
|           |       | verify | 0:02.48      | 9.25      | 0.59        | 396%      | 2.36GB     |
| keccak    | nargo | prove  | 0:07.41      | 40.26     | 0.96        | 555%      | 2.29GB     |
|           |       | verify | 0:06.62      | 39.98     | 0.62        | 613%      | 1.79GB     |
|           | yarn  | prove  | 0:21.50      | 107.59    | 2.00        | 509%      | 4.07GB     |
|           |       | verify | 0:18.11      | 95.84     | 1.04        | 534%      | 3.65GB     |
| keccak_2x | nargo | prove  | 0:14.52      | 79.77     | 1.83        | 561%      | 4.31GB     |
|           |       | verify | 0:12.44      | 76.64     | 1.24        | 626%      | 3.57GB     |
|           | yarn  | prove  | 0:42.05      | 213.33    | 3.54        | 515%      | 6.06GB     |
|           |       | verify | 0:32.77      | 184.67    | 1.52        | 568%      | 5.11GB     |

### Circuit sizes

```
+-----------+----------------------+--------------+----------------------+
| Package   | Expression Width     | ACIR Opcodes | Backend Circuit Size |
+-----------+----------------------+--------------+----------------------+
| poseidon  | Bounded { width: 3 } | 573          | 578                  |
+-----------+----------------------+--------------+----------------------+
| keccak    | Bounded { width: 3 } | 4            | 155014               |
+-----------+----------------------+--------------+----------------------+
| keccak_2x | Bounded { width: 3 } | 7            | 300405               |
+-----------+----------------------+--------------+----------------------+
| rlp       | Bounded { width: 3 } | 4188         | 11172                |
+-----------+----------------------+--------------+----------------------+
```
