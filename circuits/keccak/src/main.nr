use dep::std;

fn main(x: u8) {
    let array: [u8; 1000] = [x; 1000];
    let hash = std::hash::keccak256(array, 1000);
    assert(hash[0] == 174);
}
