# Define a list of packages separated by spaces
packages="add_mul loop if"

# Loop over each package
for prog in $packages; do
    echo "Processing package: $prog"
    cat circuits/$prog/src/main.nr
    nargo compile --package $prog
    nargo info --package $prog
    jq -r ".bytecode" target/$prog.json | base64 -d > target/$prog.acir
done

echo "Processing completed."
