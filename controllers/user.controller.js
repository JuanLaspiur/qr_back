const { request } = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { httpHandler } = require('../helpers/error-handler');

module.exports = {
  create: async (req = request, res) => {
    const { name, lastname_mother, lastname_father, email, password, role } =
      req.body;
    try {
      const user = new User({
        name,
        email: email.toLowerCase(),
        role,
        lastname_mother,
        lastname_father,
      });

      // Encriptar la contraseña;
      const salt = bcrypt.genSaltSync();
      user.password = bcrypt.hashSync(password, salt);

      await user.save();
      return res.json({ msg: 'success', user });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ msg: `A ocurrido un error: ${error.message}` });
    }
  },
  update: async (req = request, res) => {
    const { id } = req.params;
    const { password, newPass, _id, role, ...rest } = req.body;

    try {
      if (newPass) {
        const salt = bcrypt.genSaltSync();
        rest.password = bcrypt.hashSync(newPass, salt);
      }

      const user = await User.findByIdAndUpdate(id, rest, {
        new: true,
      });

      return res.json({ msg: 'success', user });
    } catch (error) {
      return httpHandler(error, res);
    }
  },
  delete: async (req = request, res) => {
    const { id } = req.params;

    try {
      const user = await User.findByIdAndUpdate(id, { state: false });
      return res.json(user);
    } catch (error) {
      return httpHandler(error, res);
    }
  },
  getAll: async (req = request, res) => {
    const { limit = 5, skip = 0, name, email, role } = req.query;

    let filter = { state: true };
    if (name) {
      filter.name = { $regex: new RegExp(name, 'i') };
    }
    if (email) {
      filter.email = { $regex: new RegExp(email, 'i') };
    }
    if (role) {
      filter.role = role;
    }

    try {
      const [total, users] = await Promise.all([
        User.countDocuments(filter),
        User.find(filter).limit(limit).skip(skip),
      ]);
      return res.json({ total, users });
    } catch (error) {
      return httpHandler(error, res);
    }
  },
  getById: async (req = request, res) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      return res.send({ msg: 'success', user });
    } catch (error) {
      return httpHandler(error, res);
    }
  },
};
