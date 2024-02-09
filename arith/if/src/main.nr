fn main(mut x: Field) {
    if x + 1 == 1 {
        x = x + 2;
    } else {
        x = x + 1;
    }
    assert(x == 2);
}
