const { Invitation, Event } = require('../models');
const {
  transporter: { mailer },
} = require('../config/mails');

const generateInvitation = async ({ name, lastname, email, event }) => {
  try {
    const currentEvent = await Event.findById(event);
    const { _id } = await Invitation.create({ name, lastname, email, event });
    currentEvent.guests = [...currentEvent.guests, _id];
    await currentEvent.save();
  } catch (error) {
    console.error(error);
  }
};

const sendMailAsync = (mailOptions, invitationData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const currentEvent = await Event.findById(invitationData.event).populate(
        'populatedGuests',
      );

      if (
        currentEvent.populatedGuests.find(
          (inv) => inv.email === invitationData.email,
        )
      ) {
        resolve({ msg: 'Ya está invitado', email: invitationData.email });
        return;
      }

      mailer.sendMail(mailOptions, async (err) => {
        if (!err) {
          try {
            await generateInvitation(invitationData);
            resolve({ msg: 'ok', email: invitationData.email });
          } catch (error) {
            reject(error);
          }
        } else {
          console.error(err);
          reject({
            msg: `Error - ${err.message}`,
            email: invitationData.email,
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateInvitation, sendMailAsync };
