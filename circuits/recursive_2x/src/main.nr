use dep::std;

struct RecursiveProof {
    verification_key: [Field; 114],
    proof: [Field; 93],
    public_inputs: [Field; 1],
    key_hash: Field
}

fn main(lhs_proof: RecursiveProof, rhs_proof: RecursiveProof) {
    std::verify_proof(
        lhs_proof.verification_key.as_slice(),
        lhs_proof.proof.as_slice(),
        lhs_proof.public_inputs.as_slice(),
        lhs_proof.key_hash
    );
    std::verify_proof(
        rhs_proof.verification_key.as_slice(),
        rhs_proof.proof.as_slice(),
        rhs_proof.public_inputs.as_slice(),
        rhs_proof.key_hash
    );
}
