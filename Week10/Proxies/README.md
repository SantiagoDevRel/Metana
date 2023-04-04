# UNSAFE CODE FOR UPGRADEABLE CONTRACTS

MUST NOT HAVE:
-constructor
-initialize called more than once
-reorder storage (should have same layout for the storage of the v1 contract)
-selfdestruct/kill function


## UUPS vs Transparent deployment
    1.
    const Token = await hre.ethers.getContractFactory("MyTokenUpgradable");
    deploy Transparent proxy
    const tokenProxy = await hre.upgrades.deployProxy(Token, ["PROXY","PRX"],{ initializer:"initialize"})

    2.
    const Token = await hre.ethers.getContractFactory("MyTokenUpgradable");
    deploy Universal upgradeable proxy standar UUPS
    const tokenProxy = await hre.upgrades.deployProxy(Token,{kind: "uups"}, ["PROXY","PRX"],{ initializer:"initialize"})
