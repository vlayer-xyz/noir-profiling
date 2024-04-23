use dep::std;

#[recursive]
fn main(x: pub u8) {
    let array: [u8; 5000] = [x; 5000];
    let hash = std::hash::keccak256(array, 5000);
    assert(hash[0] == 83);
}
