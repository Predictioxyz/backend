const { Event } = require('../models/eventModel')
const { Position } = require('../models/positionModel')
const { resolveEvent } = require('../blockchain/resolveEvent');
const { addEvent } = require('../blockchain/addEvent');
const { ethers } = require('ethers');

class EventController {
    async create(req, res) {
        try {
            const { name, chance, volume, date, summary, rules, category, image, yesName, noName } = req.body;
            const endTime = new Date(date * 1000);
            const yesPrice = (chance).toString();
            const noPrice = (100 - chance).toString();
            const eventId = await addEvent(name, Number(yesPrice), Number(noPrice))
            const question = await Event.create({
                name,
                chance,
                volume,
                date: endTime,
                summary,
                rules,
                category,
                image,
                yesName,
                noName,
                eventId
            });
            return res.json(question.id);
        } catch (error) {
            console.error('Error creating event:', error)
            return res.status(500).json({ error: 'An error occurred while creating the question' });
        }
    }

    async findOne(req, res) {
        try {
            const { id } = req.body;
            const event = await Event.findOne({ where: { id } });
            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }
            return res.json(event);
        } catch (error) {
            console.error('Error finding event:', error)
            return res.status(500).json({ error: 'An error occurred while retrieving the event' });
        }
    }

    async findMultiple(req, res) {
        try {
            const events = await Event.findAll();
            if (!events || events.length === 0) {
                return res.status(404).json({ error: 'No events found' });
            }
            return res.json(events);
        } catch (error) {
            console.error('Error finding events:', error);
            return res.status(500).json({ error: 'An error occurred while retrieving events' });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.body;
            const result = await Event.destroy({ where: { id } });
            if (result === 0) {
                return res.status(404).json({ error: 'Event not found or already deleted' });
            }
            return res.json({ success: true });
        } catch (error) {
            console.error('Error deleting event:', error)
            return res.status(500).json({ error: 'An error occurred while deleting the event' });
        }
    }

    async settle(req, res) {
        try {
            const { eventId, isYes } = req.body;
            const resolve = await resolveEvent(eventId, isYes)
            await Event.update(
                { isClosed: true },
                { where: { id: eventId } }
            )
            if (isYes === true) {
                await Position.update(
                    { status: 'Win' },
                    { where: { question: eventId, yes: true } }
                );
                await Position.update(
                    { status: 'Lose' },
                    { where: { question: eventId, yes: false } }
                );
            } else {
                await Position.update(
                    { status: 'Lose' },
                    { where: { question: eventId, yes: true } }
                );
                await Position.update(
                    { status: 'Win' },
                    { where: { question: eventId, yes: false } }
                );
            }
            return res.json({ success: true });
        } catch (error) {
            console.error('Error settling event:', error)
            return res.status(500).json({ error: 'An error occurred while settling event' });
        }
    }
}

module.exports = new EventController()