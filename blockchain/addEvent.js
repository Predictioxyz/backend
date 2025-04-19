const { ethers } = require("ethers");
const contractABI = require("./PDABI");
const provider = new ethers.JsonRpcProvider(process.env.RPC);
const privateKey = process.env.PK;
const wallet = new ethers.Wallet(privateKey, provider);

async function addEvent(description, yesPrice, noPrice) {
    const contract = new ethers.Contract(process.env.ADDRESS, contractABI, wallet);
    try {
        const eventCounter = await contract.eventCounter()
        const tx = await contract.createEvent(description, yesPrice, noPrice);
        return(Number(eventCounter) + 1)
    } catch (error) {
        console.log('Error: ', error)
    }
}  

module.exports = { addEvent };