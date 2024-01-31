use dep::std;

fn main(x: pub u8) {
    let array: [u8; 532] = [x; 532];
    let hash = std::hash::keccak256(array, 532);
    assert(hash[0] == 148);
}
