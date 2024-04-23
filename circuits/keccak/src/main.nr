use dep::std;

#[recursive]
fn main(x: pub u8) {
    // let array: [u8; 5320] = [x; 5320];
    // let hash = std::hash::keccak256(array, 5320);
    // assert(hash[0] == 23);
    let array: [u8; 532] = [x; 532];
    let hash = std::hash::keccak256(array, 532);
    assert(hash[0] == 148);
}
