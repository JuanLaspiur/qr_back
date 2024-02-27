require("colors");
const Role = require("../models/role");

const roles = [{ name: "ADMIN_ROLE" }, { name: "USER_ROLE" }];

const seedRoles = {
  importData: async () => {
    let count = 0;
    for (let i = 0; i < roles.length; i++) {
      const findRole = await Role.findOne({ name: roles[i].name });
      if (!findRole) {
        await Role.create(roles[i]);
        count++;
      }
    }
    console.log(`Roles created: ${count}`.bgGreen);
  },
  deleteData: async () => {
    let count = 0;
    for (let i = 0; i < roles.length; i++) {
      const findRole = await Role.findOneAndDelete({ name: roles[i].name });
      if (findRole) {
        count++;
      }
    }
    console.log(`Roles deleted: ${count}`.bgYellow);
  },
};

module.exports = seedRoles;
