@brief Arithmetic gate-related methods

@details The whole formula without alpha scaling is:

$$
q_{\text{arith}} \times \left( \left( -\frac{1}{2} \times (q_{\text{arith}} - 3) \times q_m \times w_1 \times w_2 \right) + \left( q_1 \times w_1 + q_2 \times w_2 + q_3 \times w_3 + q_4 \times w_4 + q_c \right) + (q_{\text{arith}} - 1) \times \left( \alpha \times (q_{\text{arith}} - 2) \times (w_1 + w_4 - w_{1_{\omega}} + q_m) + w_{4_{\omega}} \right) \right) = 0
$$

This formula results in several cases depending on `q_arith`:

1. `q_arith == 0`: Arithmetic gate is completely disabled
2. `q_arith == 1`: Everything in the minigate on the right is disabled. The equation is just a standard plonk equation with extra wires:
   $$
   q_m \times w_1 \times w_2 + q_1 \times w_1 + q_2 \times w_2 + q_3 \times w_3 + q_4 \times w_4 + q_c = 0
   $$
3. `q_arith == 2`: The `(w_1 + w_4 - ...)` term is disabled. The equation is:

   $$
   \frac{1}{2} \times q_m \times w_1 \times w_2 + q_1 \times w_1 + q_2 \times w_2 + q_3 \times w_3 + q_4 \times w_4 + q_c + w_{4_{\omega}} = 0
   $$

   It allows defining `w_4` at next index (`w_4_omega`) in terms of current wire values

4. `q_arith == 3`: The product of `w_1` and `w_2` is disabled, but a mini addition gate is enabled. `α²` allows us to split the equation into two:

   $$
   q_1 \times w_1 + q_2 \times w_2 + q_3 \times w_3 + q_4 \times w_4 + q_c + 2 \times w_{4_{\omega}} = 0
   $$

   $$
   w_1 + w_4 - w_{1_{\omega}} + q_m = 0
   $$

   (we are reusing `q_m` here)

5. `q_arith > 3`: The product of `w_1` and `w_2` is scaled by `(q_arith - 3)`, while the `w_4_omega` term is scaled by `(q_arith - 1)`. The equation can be split into two:

   $$
   (q_{\text{arith}} - 3) \times q_m \times w_1 \times w_2 + q_1 \times w_1 + q_2 \times w_2 + q_3 \times w_3 + q_4 \times w_4 + q_c + (q_{\text{arith}} - 1) \times w_{4_{\omega}} = 0
   $$

   $$
   w_1 + w_4 - w_{1_{\omega}} + q_m = 0
   $$

The problem that `q_m` is used in both equations can be dealt with by appropriately changing selector values at the next gate. Then we can treat `(q_arith - 1)` as a simulated `q_6` selector and scale `q_m` to handle `(q_arith - 3)` at the product. Uses only the alpha challenge.
