# # Define a list of packages separated by spaces
packages="1327_concrete_in_generic 1_mul 2_div 3_add 4_sub 5_over 6 6_array 7 7_function arithmetic_binary_operations array_dynamic array_eq array_len array_neq array_sort assert assert_statement assign_ex bit_and bit_shifts_comptime bit_shifts_runtime blake3 bool_not bool_or brillig_acir_as_brillig brillig_array_eq brillig_arrays brillig_assert brillig_blake2s brillig_blake3 brillig_calls brillig_calls_array brillig_calls_conditionals brillig_conditional brillig_cow brillig_ecdsa_secp256k1 brillig_ecdsa_secp256r1 brillig_fns_as_values brillig_hash_to_field brillig_identity_function brillig_keccak brillig_loop brillig_nested_arrays brillig_not brillig_oracle brillig_pedersen brillig_recursion brillig_references brillig_scalar_mul brillig_schnorr brillig_sha256 brillig_slices brillig_to_be_bytes brillig_to_bits brillig_to_bytes_integration brillig_to_le_bytes brillig_top_level brillig_unitialised_arrays cast_bool closures_mut_ref conditional_1 conditional_2 conditional_regression_421 conditional_regression_661 conditional_regression_short_circuit conditional_regression_underflow custom_entry databus debug_logs distinct_keyword double_verify_proof ecdsa_secp256k1 ecdsa_secp256r1 eddsa field_attribute generics global_consts hash_to_field higher_order_functions if_else_chain import integer_array_indexing keccak256 main_bool_arg merkle_insert missing_closure_env mock_oracle modules modules_more modulus nested_array_dynamic nested_array_in_slice nested_arrays_from_brillig operator_overloading pedersen_check pedersen_commitment pedersen_hash poseidon_bn254_hash poseidonsponge_x5_254 pred_eq prelude references regression regression_2660 regression_2854 regression_3394 regression_3607 regression_3889 regression_4088 regression_4124 regression_mem_op_predicate regression_method_cannot_be_found scalar_mul schnorr sha256 sha2_byte side_effects_constrain_array signed_arithmetic signed_comparison signed_division simple_2d_array simple_add_and_ret_arr simple_bitwise simple_comparison simple_mut simple_not simple_print simple_program_addition simple_radix simple_shield simple_shift_left_right slice_dynamic_index slices strings struct struct_array_inputs struct_fields_ordering struct_inputs submodules to_be_bytes to_bytes_consistent to_bytes_integration to_le_bytes trait_as_return_type trait_impl_base_type traits_in_crates_1 traits_in_crates_2 tuple_inputs tuples type_aliases u128 unconstrained_empty unsafe_range_constraint workspace workspace_default_member xor"
# packages="array_eq to_be_bytes"

# Loop over each package
for prog in $packages; do
    # echo "Processing package: $prog"
    # cat noir_tests/$prog/src/main.nr
    nargo compile --package $prog --deny-warnings 2> /dev/null || echo $prog
    # nargo info --package $prog --deny-warnings
    # jq -r ".bytecode" target/$prog.json | base64 -d > target/$prog.acir.gz
    # gunzip < target/$prog.acir.gz > target/$prog.acir
    # # hexdump -C target/$prog.acir
    # # jq -r ".bytecode" target/$prog.json > target/$prog.acir
    # ../aztec-packages/barretenberg/cpp/build/bin/bb gates -b target/$prog.acir.gz -c ../aztec-packages/barretenberg/cpp/crs > target/$prog.circuit && echo "OK" || echo "FAIL"
done

echo "Processing completed."
