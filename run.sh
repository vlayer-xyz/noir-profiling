packages="signed_comparison"

for prog in $packages; do
    # echo "Processing package: $prog"
    # cat noir_tests/$prog/src/main.nr
    nargo compile --package $prog --deny-warnings
    nargo info --package $prog --deny-warnings
    jq -r ".bytecode" target/$prog.json | base64 -d > target/$prog.acir.gz
    gunzip < target/$prog.acir.gz > target/$prog.acir
    # hexdump -C target/$prog.acir
    # jq -r ".bytecode" target/$prog.json > target/$prog.acir
    ../aztec-packages/barretenberg/cpp/build/bin/bb gates -b target/$prog.acir.gz -c ../aztec-packages/barretenberg/cpp/crs > target/$prog.circuit && echo "OK" || echo "FAIL"
done

echo "Processing completed."
