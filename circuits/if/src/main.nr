fn main(mut x: Field) {
    if x == 0 {
        x = x * x;
    } else {
        x = x + 1;
    }
    assert(x == -1);
}
