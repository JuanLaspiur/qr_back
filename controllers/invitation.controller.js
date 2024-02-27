const { request, response } = require('express');
const { readFileSync } = require('fs');
const { toDataURL } = require('qrcode');
const path = require('path');
const { httpHandler } = require('../helpers/error-handler');
const { Event, Invitation } = require('../models');
const { excelToJson } = require('../helpers');
const { generateTemplateHtml } = require('../helpers/generate-email');
const { sendMailAsync } = require('../helpers/generate-invitation');
require("dotenv").config();

const logoPath = path.join(__dirname, '..', 'emails/logo.svg');
const logo = readFileSync(logoPath, 'utf-8');

module.exports = {
  invitationPost: async (req = request, res = response) => {
    console.log("ENTRE");
    const { name, lastname, email, event } = req.body;

    try {
      const { name: eventName } = await Event.findById(event);
      const template = generateTemplateHtml();
      const qr = await toDataURL(JSON.stringify({ event, email }));
      const data = {
        logo: `data:image/svg+xml;base64,${Buffer.from(logo).toString(
          'base64',
        )}`,
        lastname,
        eventName,
        name,
        qr,
        url:`https://coraqr-back2.onrender.com/api/qrcreate?event=${event}&email=${email}`
      };

      const invitationData = { name, lastname, email, event };

      const html = template(data);

      const mailOptions = {
        from: 'sender@server.com',
        to: email,
        subject: 'Invitación a evento ',
        html,
      };

      await sendMailAsync(mailOptions, invitationData).then(() =>
        res.send({ msg: 'ok' }),
      );
    } catch (error) {
      return httpHandler(error, res);
    }
  }
,
  invitationMasivePost: async (req = request, res) => {
    const { id: event } = req.params;
    try {
      const excelData = excelToJson(req.files.file);

      const { name: eventName } = await Event.findById(event);

      const [...all] = await Promise.all(
        excelData.map(async ({ nombre: name, email, apellido: lastname }) => {
          const template = generateTemplateHtml();

          const qr = await toDataURL(JSON.stringify({ event, email }));

          const data = {
            logo: `data:image/svg+xml;base64,${Buffer.from(logo).toString(
              'base64',
            )}`,
            lastname,
            eventName,
            name,
            qr,
            url:`https://coraqr-back2.onrender.com/api/qrcreate?event=${event}&email=${email}`
          };

          const invitationData = { name, email, lastname, event };

          const mailOptions = {
            from: 'sender@server.com',
            to: email,
            subject: 'Invitación a evento',
            html: template(data),
          };

          return await sendMailAsync(mailOptions, invitationData)
            .then((e) => e)
            .catch((e) => e);
        }),
      );

      return res.json(all);
    } catch (error) {
      return httpHandler(error, res);
    }
  },
  guestGet: async (req = request, res) => {
    const { id } = req.params;
    const { limit = 5, skip = 0, name, state, email } = req.query;

    try {
      const { name: eventName } = await Event.findById(id);

      let filter = { event: id };

      if (name) {
        filter.name = { $regex: new RegExp(name, 'i') };
      }
      if (email) {
        filter.email = { $regex: new RegExp(email, 'i') };
      }
      if (state) {
        filter.state = state;
      }

      const invitations = await Invitation.find(filter).limit(limit).skip(skip);

      const total = await Invitation.countDocuments(filter);

      return res.json({ msg: 'ok', total, eventName, invitations });
    } catch (error) {
      return httpHandler(error, res);
    }
  },

  invitationPut: async (req = request, res) => {
    const { event, email } = req.body;
    try {
      const invitation = await Invitation.findOne({ email, event });
      if (invitation) {
        if (invitation.state === 'pending') {
          invitation.state = 'confirmed';
          await invitation.save();
          return res.send({ msg: 'ok', invitation });
        }
        return res.send({ msg: 'Ya asistío' });
      } else {
        return res.status(401).json({ msg: 'Invitación inválida' });
      }
    } catch (error) {
      return httpHandler(error, res);
    }
  },
};
