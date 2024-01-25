#!/bin/bash

packages=("poseidon" "rlp" "keccak" "keccak_2x")

TIME_FORMAT='
Elapsed Time: %E
User Time: %U
System Time: %S
CPU Usage: %P
Max Memory: %M'

convert_memory() {
    local kilobytes=$1
    local megabytes=$(echo "scale=2; $kilobytes / 1024" | bc)
    if (( $(echo "$megabytes < 1024" | bc -l) )); then
        echo "${megabytes}MB"
    else
        local gigabytes=$(echo "scale=2; $megabytes / 1024" | bc)
        echo "${gigabytes}GB"
    fi
}

echo "| Package | Elapsed Time | User Time | System Time | CPU Usage | Max Memory |"
echo "|---------|--------------|-----------|-------------|-----------|------------|"

for package in "${packages[@]}"; do
    temp_file=$(mktemp)
    gtime -f "$TIME_FORMAT" nargo prove --package="${package}" > "$temp_file" 2>&1
    output=$(<"$temp_file")

    elapsed_time=$(echo "$output" | grep 'Elapsed Time' | awk '{print $3}')

    user_time=$(echo "$output" | grep 'User Time' | awk '{print $3 " " $4}')
    system_time=$(echo "$output" | grep 'System Time' | awk '{print $3 " " $4}')
    cpu_usage=$(echo "$output" | grep 'CPU Usage' | awk '{print $3}')
    max_memory_kb=$(echo "$output" | grep 'Max Memory' | awk '{print $3}')
    max_memory=$(convert_memory "$max_memory_kb")

    echo "| $package | $elapsed_time | $user_time | $system_time | $cpu_usage | $max_memory |"

    rm "$temp_file"
done
