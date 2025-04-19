const sequelize = require('../db')
const {Position} = require('../models/positionModel')
const {User} = require('../models/userModel')
const {Event} = require('../models/eventModel')
const { getTransactionDetails } = require('../blockchain/checkTransaction')

class PositionController {
    async open(req, res) {
        try {
            const { wallet, eventId, yes, amount, price, txHash } = req.body;
            if (!wallet || !eventId || yes === undefined || !amount || !price || !txHash) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const transactionStatus = await getTransactionDetails(txHash);
            if (transactionStatus !== 1) {
                return res.status(400).json({ error: 'Invalid transaction' });
            }
            const position = await Position.create({
                wallet,
                date: new Date(),
                eventId,
                yes,
                amount,
                price,
                status: "Open"
            });
            await User.update(
                { positions: sequelize.fn('array_append', sequelize.col('positions'), position.id)},
                { where: { wallet } }
            );
            return res.status(201).json(position);
        } catch (error) {
            console.error('Error in open position:', error);
            return res.status(500).json({ error: 'Failed to open position' });
        }
    }

    async fetch(req, res) {
        try {
            const { wallet } = req.body;
            if (!wallet) {
                return res.status(400).json({ error: 'Wallet is required' });
            }
            const positions = await Position.findAll({ where: { wallet } });
            if (!positions || positions.length === 0) {
                return res.status(404).json({ error: 'No positions found' });
            }
            return res.json(positions);
        } catch (error) {
            console.error('Error fetching positions:', error);
            return res.status(500).json({ error: 'Failed to fetch positions' });
        }
    }

    async close(req, res) {
        try {
            const { wallet, txHash, positionId } = req.body;
            if (!wallet || !txHash || !positionId) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const transactionStatus = await getTransactionDetails(txHash);
            if (transactionStatus !== 1) {
                return res.status(400).json({ error: 'Invalid transaction' });
            }
            const position = await Position.findOne({ where: { id: positionId } });
            if (!position) {
                return res.status(404).json({ error: 'Position not found' });
            }
            const sum = position.price * position.amount;
            const user = await User.findOne({ where: { wallet } });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            await User.update(
                { balance: user.balance + sum },
                { where: { wallet } }
            );
            await Position.update(
                { status: 'Closed' },
                { where: { id: positionId } }
            );
            return res.json({ success: true });
        } catch (error) {
            console.error('Error closing position:', error);
            return res.status(500).json({ error: 'Failed to close position' });
        }
    }

    async withdraw(req, res) {
        try {
            const { wallet, txHash, positionId } = req.body;
            if (!wallet || !txHash || !positionId) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const transactionStatus = await getTransactionDetails(txHash);
            if (transactionStatus !== 1) {
                return res.status(400).json({ error: 'Invalid transaction' });
            }
            await Position.update(
                { isClaimed: true },
                { where: { id: positionId } }
            );
            return res.json({ success: true });
        } catch (error) {
            console.error('Error withdrawing:', error);
            return res.status(500).json({ error: 'Failed to withdraw' });
        }
    }
}

module.exports = new PositionController()