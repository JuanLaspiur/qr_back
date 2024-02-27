const { Schema, model } = require("mongoose");

const invitationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  state: {
    type: String,
    enum: ["pending", "confirmed"],
    default: "pending",
  },
});

invitationSchema.methods.toJSON = function () {
  const { __v, ...rest } = this.toObject();
  return { ...rest };
};

module.exports = model("Invitation", invitationSchema);
