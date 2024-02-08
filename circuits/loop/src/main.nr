fn main(mut x: Field) {
    for _ in 0..2 {
        x = x * x;
    }
    assert(x == -1);
}
