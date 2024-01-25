# noir-profiling

## Working on this project
You can print the number of opcodes in all circuits:
```
nargo info --workspace
```

Or regenerate profiling info:
```
./prove.sh
```

## Results

### Proving times (nargo, M1 Max)

| Package    | Elapsed Time | User Time | System Time | CPU Usage | Max Memory |
|------------|--------------|-----------|-------------|-----------|------------|
| poseidon   |    0:00.64    |    1.17s  |     0.19s   |     211%  |  148.99MB   |
| rlp        |    0:01.20    |    0.92s  |     0.03s   |      79%  |   96.17MB   |
| keccak     |    0:07.57    |   40.40s  |     0.94s   |     545%  |    2.30GB   |
| keccak_2x  |    0:15.00    |   79.91s  |     1.75s   |     544%  |    4.32GB   |

### Verification times (nargo M1 Max)

| Package    | Elapsed Time | User Time | System Time | CPU Usage | Max Memory |
|------------|--------------|-----------|-------------|-----------|------------|
| poseidon   |    0:00.61    |     0.86  |      0.14   |     165%  |  143.35MB   |
| rlp        |    0:01.19    |     3.57  |      0.18   |     316%  |  244.38MB   |
| keccak     |    0:06.66    |    39.96  |      0.60   |     609%  |    1.80GB   |
| keccak_2x  |    0:12.39    |    76.51  |      1.15   |     626%  |    3.50GB   |



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