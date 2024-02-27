require("colors");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const salt = bcrypt.genSaltSync();

const users = [
  {
    name: "admin",
    lastname_mother: "lorem",
    lastname_father: "ipsum",
    email: "admin@eiche2024.com",
    password: bcrypt.hashSync("EICHE2024", salt),
    role: "ADMIN_ROLE",
  },
  {
    name: "dev@eiche2024.com",
    lastname_mother: "lorem",
    lastname_father: "ipsum",
    email: "dev@eiche2024.com",
    password: bcrypt.hashSync("EICHE2024", salt),
    role: "USER_ROLE",
  },
];

const seedUser = {
  importData: async () => {
    let count = 0;
    for (let i = 0; i < users.length; i++) {
      const findUser = await User.findOne({ email: users[i].email });
      if (!findUser) {
        await User.create(users[i]);
        count++;
      }
    }
    console.log(`Users created: ${count}`.bgGreen);
  },
  deleteData: async () => {
    let count = 0;
    for (let i = 0; i < users.length; i++) {
      const findUser = await User.findOneAndDelete({ email: users[i].email });
      if (findUser) {
        count++;
      }
    }
    console.log(`Users deleted: ${count}`.bgYellow);
  },
};

module.exports = seedUser;
