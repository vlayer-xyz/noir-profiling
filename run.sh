# Define a list of packages separated by spaces
packages="if"

# Loop over each package
for prog in $packages; do
    echo "Processing package: $prog"
    cat circuits/$prog/src/main.nr
    nargo compile --package $prog
    nargo info --package $prog
    jq -r ".bytecode" target/$prog.json | base64 -d > target/$prog.acir.gz
    gunzip < target/$prog.acir.gz > target/$prog.acir
    hexdump -C target/$prog.acir
    # jq -r ".bytecode" target/$prog.json > target/$prog.acir
    # ../barretenberg/cpp/build/bin/bb gates -b target/$prog.acir -c ../barretenberg/cpp/crs > target/$prog.circuit
done

echo "Processing completed."
