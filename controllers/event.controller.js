const { request } = require('express');
const Event = require('../models/event');
const { httpHandler } = require('../helpers/error-handler');

module.exports = {
  eventPost: async (req = request, res) => {
    const { name, description = 'N/A', date, max } = req.body;
    try {
      const data = {
        name,
        description,
        date,
        max,
      };
      const event = await Event.create(data);
      return res.status(201).json({ msg: 'ok', event });
    } catch (error) {
      return httpHandler(error, res);
    }
  },
  eventPut: async (req = request, res) => {
    const { name, description = 'N/A', date, max } = req.body;

    const { id } = req.params;
    try {
      const event = await Event.findByIdAndUpdate(
        id,
        {
          description,
          max,
          name,
          date,
        },
        { new: true },
      );
      return res.json({ msg: 'ok', event });
    } catch (error) {
      return httpHandler(error, res);
    }
  },
  eventDelete: async (req = request, res) => {
    const { id } = req.params;
    try {
      const { deletedCount } = await Event.findByIdAndUpdate(
        id,
        {
          state: false,
        },
        { new: true },
      );
      return res.json({ msg: 'ok', deletedCount });
    } catch (error) {
      return httpHandler(error, res);
    }
  },
  eventGet: async (req = request, res) => {
    const { limit = 5, skip = 0, name, date } = req.query;
    try {
      let filter = { state: true };

      if (name) {
        filter.name = { $regex: new RegExp(name, 'i') };
      }
      if (date) {
        filter.date = { $regex: new RegExp(date, 'i') };
      }

      const [total, events] = await Promise.all([
        Event.countDocuments(filter),
        Event.find(filter).limit(limit).skip(skip),
      ]);

      return res.json({ total, events });
    } catch (error) {
      return httpHandler(error, res);
    }
  },

  eventAddGuest: async (req = request, res) => {},
};
