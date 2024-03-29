# Assignment Week 12

### Damn vulnerable defi - compromised

We are getting the following numbers from the server error:

    4d 48 68 6a 4e 6a 63 34 5a 57 59 78 59 57 45 30 4e 54 5a 6b 59 54 59 31 59 7a 5a 6d 59 7a 55 34 4e 6a 46 6b 4e 44 51 34 4f 54 4a 6a 5a 47 5a 68 59 7a 42 6a 4e 6d 4d 34 59 7a 49 31 4e 6a 42 69 5a 6a 42 6a 4f 57 5a 69 59 32 52 68 5a 54 4a 6d 4e 44 63 7a 4e 57 45 35

    4d 48 67 79 4d 44 67 79 4e 44 4a 6a 4e 44 42 68 59 32 52 6d 59 54 6c 6c 5a 44 67 34 4f 57 55 32 4f 44 56 6a 4d 6a 4d 31 4e 44 64 68 59 32 4a 6c 5a 44 6c 69 5a 57 5a 6a 4e 6a 41 7a 4e 7a 46 6c 4f 54 67 33 4e 57 5a 69 59 32 51 33 4d 7a 59 7a 4e 44 42 69 59 6a 51 34

-We need to convert these numbers to hex
-That hex is 32bytes long, its the private address of one of the oracles

# ISSUE:

-after decoding the first response, I was able to get the same string value:
'MHhjNjc4ZWYxYWE0NTZkYTY1YzZmYzU4NjFkNDQ4OTJjZGZhYzBjNmM4YzI1NjBiZjBjOWZiY2RhZTJmNDczNWE5'
but I wasn't able to parse into hex to get:
'0xc678ef1aa456da65c6fc5861d44892cdfac0c6c8c2560bf0c9fbcdae2f4735a9'

## Solution

-will assume these 2 are the private keys:
0xc678ef1aa456da65c6fc5861d44892cdfac0c6c8c2560bf0c9fbcdae2f4735a9
0x208242c40acdfa9ed889e685c23547acbed9befc60371e9875fbcd736340bb48

1. there are 3 oracles in total, so we will update the prices of 2 oracles to make it 1 wei
2. we call the oracle.postPrice(1 wei) function in the oracles from the 2 sources
3. we can buy 1 NFT for 1 wei, by calling exchange.buyOne({value: 1 wei})
4. then we can raise the prices again to the total exchange balance
   by calling oracle.postPrice(exchangeBalance) from our 2 sources
5. we can sell the NFT to the exchange again for the whole exchange balance by calling
   exchange.sellOne(nftId) - we need to approve the nft first
6. we set the prices of the oracle to the initial price
7. we are done

[Link level](https://www.damnvulnerabledefi.xyz/challenges/compromised/)
[Solution article](https://iphelix.medium.com/damn-vulnerable-defi-challenge-7-walkthrough-ee9fac3fdcd4)
