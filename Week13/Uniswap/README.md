# Hardhat impersonate account

    1. Modify hardhat.config with:
        networks: {
            hardhat: {
                forking: {
                    url: `${API_MAINNET_URL}`,
                },
            },
        },

    2. Impersonate X address:
        const X_ADDRESS = 0x1689a089AA12d6CbBd88bC2755E4c192f8702000;

    3. Write the impersonate method on the test:
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [X_ADDRESS],
        });

    4. Instance of the X signer:
        X_SIGNER = await ethers.getSigner(X_ADDRESS);

    5. Ready to go, now we can sign transactions with the X_SIGNER account
