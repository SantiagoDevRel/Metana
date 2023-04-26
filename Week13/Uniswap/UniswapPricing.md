# Uniswap Pricing

    X * Y = K

    ( X + dx ) * ( Y - dy ) = K

    ( Y - dy ) = K / ( X + dx )

    dy = Y - K / ( X + dx )

    dy = Y - (XY) / ( X + dx )

    Example:
        swap 10.000 token X for Y

        X = 50.000
        Y = 20.000
        K = 1.000.000.000

        ( 50.000 + 10.000 ) * ( 20.000 - dy ) = 1.000.000.000

        ( 20.000 - dy ) = 1.000.000.000 / ( 60.000 )

        dy = 20.000 - (1.000.000.000 / 60.000)

        dy = -3.333,333

        ( 50.000 + 10.000 ) * ( 20.000 - 3.333,333 ) = 1.000.000.000

        60.000 * 16.666,67 = 1.0000.000.000

# Formulas to find dy:

    1. dy = Y - K / ( X + dx )

    2. dy = Y - (XY) / ( X + dx )

    3. dy = (Y * dx) / (X + dx)

# Adding uniswap fees 0.3%

    dy = (Y * 0.997 * dx) / (X + (0.997 * dx))

    dy = 199.400.000 / 59.970

    dy = 3.324,99

[Youtube source](https://www.youtube.com/watch?v=IL7cRj5vzEU)
