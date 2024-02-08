
# Define a list of packages separated by spaces
packages="1327_concrete_in_generic array_eq array_len array_sort assert assert_statement assign_ex bool_not bool_or brillig_array_eq brillig_arrays brillig_blake3 brillig_conditional brillig_cow brillig_hash_to_field brillig_identity_function brillig_loop brillig_nested_arrays brillig_oracle brillig_pedersen brillig_references brillig_scalar_mul brillig_schnorr brillig_slices brillig_to_be_bytes brillig_to_bits brillig_to_bytes_integration brillig_to_le_bytes brillig_top_level brillig_unitialised_arrays cast_bool closures_mut_ref custom_entry debug_logs distinct_keyword generics higher_order_functions import main_bool_arg missing_closure_env mock_oracle modules modules_more nested_arrays_from_brillig pred_eq prelude references simple_2d_array simple_add_and_ret_arr simple_mut simple_not simple_print simple_program_addition simple_radix struct struct_array_inputs struct_fields_ordering submodules to_bytes_consistent trait_impl_base_type traits_in_crates_1 traits_in_crates_2 tuples type_aliases unconstrained_empty"

# Loop over each package
for prog in $packages; do
    # echo "Processing package: $prog"
    # cat execution_success/$prog/src/main.nr
    nargo info --package $prog
done

echo "Processing completed."
