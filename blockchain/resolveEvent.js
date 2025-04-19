const { ethers } = require("ethers");
const contractABI = require("./PDABI");
const provider = new ethers.JsonRpcProvider(process.env.RPC);
const privateKey = process.env.PK;
const wallet = new ethers.Wallet(privateKey, provider);

async function resolveEvent(eventId, outcome) {
    const contract = new ethers.Contract(process.env.ADDRESS, contractABI, wallet);
    const tx = await contract.resolveEvent(eventId, outcome);
}  

module.exports = { resolveEvent };