use dep::std;

#[recursive]
fn main(x: pub Field) {
    let hash = std::hash::poseidon::bn254::hash_1([x]);
    assert(hash == 0x1b408dafebeddf0871388399b1e53bd065fd70f18580be5cdde15d7eb2c52743);
}
