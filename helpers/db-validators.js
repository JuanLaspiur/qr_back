const { request } = require('express');
const bcrypt = require('bcrypt');
const { Role, User, Event, Invitation, Establishment } = require('../models');

module.exports = {
  validateRol: async (role = '') => {
    const exist = await Role.findOne({ role });
    if (!exist) throw new Error(`El rol: ${role} no es válido`);
  },
  emailExist: async (email = '') => {
    const exist = await User.findOne({ email });
    if (exist) throw new Error(`El email: ${email}, ya esta registrado`);
  },
  userByIdExist: async (id = '') => {
    const exist = await User.findById(id);
    if (!exist) throw new Error(`El usuario con ID ${id} no existe`);
  },
  eventExist: async (id = '') => {
    const exist = await Event.findById(id);
    if (!exist) throw new Error(`El evento con ID${id} no existe`);
  },
  establishmentExist: async (id = '') => {
    const exist = await Establishment.findById(id);
    if (!exist) throw new Error(`El establecimiento con ID${id} no existe`);
  },
  invitationExist: async (event, { req }) => {
    const { email } = req.body;
    const currentEvent = await Event.findById(event).populate(
      'populatedGuests',
    );
    if (currentEvent.populatedGuests.find((inv) => inv.email === email))
      throw new Error('Ya esta invitado a ese evento');
  },
  passCheck: async (password, { req = request }) => {
    try {
      const user = req.user;
      const match = bcrypt.compareSync(password, user.password);
      if (!match) {
        throw new Error('La contraseña es incorrecta');
      }
    } catch (error) {
      console.error(error.message);
      throw new Error('Error al verificar la contraseña');
    }
  },
  allowedCollections: (collection = '', collections = '') => {
    if (!collections.includes(collection))
      throw new Error(
        `La colección ${collection} no es válida - ${collections}`,
      );
    return true;
  },
};
