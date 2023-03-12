# Hardhat Impersonate Account

1. use command
   const BinanceSigner = null
   const BinanceWallet = "0xF977814e90dA44bFA03b6295A0616a897441aceC"

await hre.network.provider.request({
method: "hardhat_impersonateAccount",
params: [BinanceWallet],
});

2. Get the signer from that wallet
   BinanceSigner = await ethers.getSigner(BinanceWallet)

3. Connect to any contract
   contract.connect(BinanceSigner).doSomething()
