const { request } = require('express');
const Establishment = require('../models/establishment');
const { httpHandler } = require('../helpers/error-handler');

module.exports = {
  establishmentPost: async (req = request, res) => {
    const { name, type } = req.body;
    try {
      const data = {
        name,
        type,
      };
      const establishment = await Establishment.create(data);
      return res.status(201).json({ msg: 'ok', establishment });
    } catch (error) {
      return httpHandler(error, res);
    }
  },
  establishmentPut: async (req = request, res) => {
    const { name, type } = req.body;

    const { id } = req.params;
    try {
      const establishment = await Establishment.findByIdAndUpdate(
        id,
        {
          name,
          type,
        },
        { new: true },
      );
      return res.json({ msg: 'ok', establishment });
    } catch (error) {
      return httpHandler(error, res);
    }
  },
  establishmentDelete: async (req = request, res) => {
    const { id } = req.params;
    try {
      const { deletedCount } = await Establishment.deleteOne({ _id: id });
      return res.json({ msg: 'ok', deletedCount });
    } catch (error) {
      return httpHandler(error, res);
    }
  },

  establishmentGet: async (req = request, res) => {
    const { limit = 5, skip = 0, name, type } = req.query;
    try {
      let filter = {};

      if (name) {
        filter.name = { $regex: new RegExp(name, 'i') };
      }
      if (type) {
        filter.type = type;
      }

      const [total, establishments] = await Promise.all([
        Establishment.countDocuments(filter),
        Establishment.find().limit(limit).skip(skip),
      ]);

      return res.json({ total, establishments });
    } catch (error) {
      return httpHandler(error, res);
    }
  },
};
