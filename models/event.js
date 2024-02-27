const { Schema, model } = require("mongoose");

const eventSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  max: {
    type: Number,
    required: true,
  },
  description: String,
  state: {
    type: Boolean,
    default: true,
  },
  guests: [
    {
      type: Schema.Types.ObjectId,
      ref: "Invitation",
    },
  ],
});

eventSchema.methods.toJSON = function () {
  const { __v, state, ...rest } = this.toObject();
  return { ...rest };
};

// Modificación para usar populate
eventSchema.virtual("populatedGuests", {
  ref: "Invitation",
  localField: "guests",
  foreignField: "_id",
});

eventSchema.pre("find", function () {
  this.populate("populatedGuests");
});

module.exports = model("Event", eventSchema);
