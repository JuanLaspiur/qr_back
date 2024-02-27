const { Schema, model } = require('mongoose');

const establishmentSchema = Schema({
  name: {
    type: String,
    required: [true, 'Nombre es obligatorio'],
  },

  type: {
    type: String,
    require: true,
    enum: ['ADMIN', 'COUNTER'],
  },
  state: {
    type: Boolean,
    default: true,
  },
});
establishmentSchema.methods.toJSON = function () {
  const { __v, state, ...rest } = this.toObject();
  return { ...rest };
};

module.exports = model('Establishment', establishmentSchema);
