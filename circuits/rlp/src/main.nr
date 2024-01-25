use dep::std;
use dep::proof::rlp;

global MAX_HEADER_RLP_SIZE = 532;
global HEADER_FIELDS_COUNT = 17;

fn main(block_header: pub [u8; MAX_HEADER_RLP_SIZE]) {
    let decoded: rlp::RLP_List<HEADER_FIELDS_COUNT> = rlp::decode1(block_header);
    assert(decoded.num_fields == HEADER_FIELDS_COUNT);
}
