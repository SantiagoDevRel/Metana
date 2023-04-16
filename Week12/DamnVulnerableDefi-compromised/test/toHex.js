const { ethers } = require("hardhat");
const { utils } = require("ethers");

async function main(response) {
  //1. convert the string into a hex number with no blank spaces and 0x
  const hexString = "0x" + response.replace(/\s/g, "");

  //2. convert the hexString to array of bytes
  const bytes = ethers.utils.arrayify(hexString);

  //3. convert the array of bytes to ASCII
  const asciiString = ethers.utils.toUtf8String(bytes);
  console.log(asciiString);
  //MHhjNjc4ZWYxYWE0NTZkYTY1YzZmYzU4NjFkNDQ4OTJjZGZhYzBjNmM4YzI1NjBiZjBjOWZiY2RhZTJmNDczNWE5
  //console.log(utils.hexlify(utils.base64.decode(asciiString)));

  //4. convert eh ASCII to base64
  /* const decode64 = utils.base64.decode(hexString);
  console.log(utils.hexlify(decode64), "\n");
  const decode65 = utils.base64.decode(bytes);
  console.log(utils.hexlify(decode65), "\n");
  const decode66 = utils.base64.decode(asciiString);
  console.log(utils.hexlify(decode66), "\n"); */
}

const response =
  "4d 48 68 6a 4e 6a 63 34 5a 57 59 78 59 57 45 30 4e 54 5a 6b 59 54 59 31 59 7a 5a 6d 59 7a 55 34 4e 6a 46 6b 4e 44 51 34 4f 54 4a 6a 5a 47 5a 68 59 7a 42 6a 4e 6d 4d 34 59 7a 49 31 4e 6a 42 69 5a 6a 42 6a 4f 57 5a 69 59 32 52 68 5a 54 4a 6d 4e 44 63 7a 4e 57 45 35";

main(response);
