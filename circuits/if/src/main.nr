fn main(mut x: Field) {
    if x + 1 == 1 {
        x = x + 2;
    } else {
        x = x + 1;
    }
    assert(x == -1);
}

// BRILLIG: 
//     inputs: [Single(Expression { mul_terms: [], linear_combinations: [(1, Witness(0))], q_c: 0 })]
//     outputs: [Simple(Witness(1))]
//     [
//         JumpIfNot { condition: RegisterIndex(0), location: 3 },
//         Const { destination: RegisterIndex(1), value: Value { inner: 1 } },
//         BinaryFieldOp { destination: RegisterIndex(0), op: Div, lhs: RegisterIndex(1), rhs: RegisterIndex(0) },
//         Stop
//     ]

// p * x + (1-p)* y = 0

// After Constraint Bubbling:
// acir fn main f0 {
//   b0(v0: Field):
//     v62 = add v0, Field 1 // x+1
//     v63 = eq v62, Field 1 // x+1 == 1
//     enable_side_effects v63 // enable side effects
//     v64 = add v0, Field 2 // x+2
//     v65 = not v63 // not (x+1 == 1)
//     enable_side_effects u1 1 // enable side effects
//     v66 = cast v63 as Field // cast then pred to field
//     v67 = cast v65 as Field // cast else pred to field
//     v68 = mul v66, v64 // then value
//     v69 = mul v67, v62 // else value
//     v70 = add v68, v69 // if value
//     constrain v70 == Field -1
//     return
// }