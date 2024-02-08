fn main(x: Field, y: Field) {
    let a = x + x;
    let b = a + 1;
    let c = b * y;
    let d = c * 2 + 3;
    assert(d == 1);
}
