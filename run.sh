# packages="assert_field_equals add_mul return loop if pythagorean_triplet"
packages="u1_comparison u2_comparison u8_comparison"
# packages="if"
# packages="u8_comparison"
# packages="pythagorean_triplet"

for prog in $packages; do
    echo "Processing package: $prog"
    cat arith/$prog/src/main.nr
    nargo compile --package $prog --deny-warnings
    # nargo compile --package $prog --deny-warnings --show-ssa
    nargo info --package $prog --deny-warnings
    jq -r ".bytecode" target/$prog.json | base64 -d > target/$prog.acir.gz
    gunzip < target/$prog.acir.gz > target/$prog.acir
    # hexdump -C target/$prog.acir
    # jq -r ".bytecode" target/$prog.json > target/$prog.acir
    ../aztec-packages/barretenberg/cpp/build/bin/bb gates -b target/$prog.acir.gz -c ../aztec-packages/barretenberg/cpp/crs > target/$prog.circuit
    nargo execute --package $prog $prog
    ../aztec-packages/barretenberg/cpp/build/bin/bb get_witness -w target/$prog.gz > target/$prog.witness
    yarn --silent tsx src/index.ts --package $prog --action gates
    echo "==================================="
    echo ""
done

echo "Processing completed."
