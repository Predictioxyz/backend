const { ethers } = require("ethers");
const contractABI = require("./PDABI");
const provider = new ethers.JsonRpcProvider(process.env.RPC);
const privateKey = process.env.PK
const wallet = new ethers.Wallet(privateKey, provider);

async function getTransactionDetails(txHash) {
  try {
        const tx = await provider.getTransactionReceipt(txHash);
        return(tx.status)
  } catch (error) {
        console.error("Error fetching transaction:", error);
  }
}

module.exports = { getTransactionDetails };

if (require.main === module) {
    getTransactionDetails('')
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
}
