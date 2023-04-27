# Optimal One-sided Supply

    A = amount token A in uniswap
    B = amount token B in uniswap
    f = trading fee
    a = amount token A I have
    b = ? amount token B i need
    s = ? amount token A we will swap foA B

    K = A * B

    K = (A + (1-f)*s) * (B - b)

    Formula:

    s = (sqrt(((2-f)A)^2 + 4(1-f)a*A) - (2-f)*A ) / (2*(1-f))

        sqrt((( 2 - f ) A )^2 + 4 ( 1 - f ) a * A ) - (2 - f) * A
    s = __________________________________________________________
                    2 * (1 - f)

![](./Images/s_formula_optimal_price.png)

    Example:

    A = 500
    B = 250
    f = 0.3%
    a = 200
    b = ?
    s = ?

    K = (A + (1-f)*s) * (B - b)

    125.000 = (500 + (1-0.3 % 100) * s) * (250 - b)

[Youtube souAce](https://www.youtube.com/watch?v=1ivHqueaTVo)
