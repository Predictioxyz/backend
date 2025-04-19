const sequelize = require('../db')
const { User } = require('../models/userModel')

class UserController {
    async connect(req, res) {
        try {
            const { wallet } = req.body;
            let user = await User.findOne({ where: { wallet } });
            if (user) {
                return res.json(user);
            } else {
                user = await User.create({ wallet });
                return res.json(user);
            }
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while processing the request' });
        }
    }
    async check(req, res) {
        try {
            const { wallet } = req.body;
            const user = await User.findOne({ where: { wallet } });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            return res.json(user.balance);
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred while fetching the user balance' });
        }
    }
    async addCard(req, res) {
        const { wallet, eventId } = req.body;
        if (!wallet || !eventId) {
            return res.status(400).json({ error: 'wallet and eventId are required' });
        }
        try {
            const user = await User.findOne({ where: { wallet } });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const watchlist = Array.isArray(user.watchlist) ? user.watchlist : [];
            if (!watchlist.includes(eventId)) {
                watchlist.push(eventId);
                await User.update({ watchlist: watchlist }, { where: { wallet } });
            }


            return res.json({
                success: true,
                watchlist: watchlist
            });

        } catch (error) {
            console.error('Error in addCard:', error);
            return res.status(500).json({ error: 'An error occurred while adding card' });
        }
    }
    async removeCard(req, res) {
        const { wallet, eventId } = req.body;
        if (!wallet || !eventId) {
            return res.status(400).json({ error: 'wallet and eventId are required' });
        }
        try {
            const user = await User.findOne({ where: { wallet } });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (!Array.isArray(user.watchlist)) {
                user.watchlist = [];
            }
            const initialLength = user.watchlist.length;
            user.watchlist = user.watchlist.filter(id => id !== eventId);
            if (user.watchlist.length !== initialLength) {
                await user.save();
            }
            return res.json({
                success: true,
                watchlist: user.watchlist,
                removed: initialLength !== user.watchlist.length
            });
        } catch (error) {
            console.error('Error in removeCard:', error);
            return res.status(500).json({ error: 'An error occurred while removing card' });
        }
    }
    async showCards(req, res) {
        const { wallet } = req.body;
        const user = await User.findOne({ where: { wallet } });
        return res.json(user.watchlist);
    }
}

module.exports = new UserController()