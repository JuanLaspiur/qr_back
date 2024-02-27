require("colors");
const seedUsers = require("./user.seed");
const seedRoles = require("./role.seed");

const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

(async () => {
  try {
    console.log("**** DB connected ****".bgGreen + "\n");

    await seedUsers.deleteData();
    await seedRoles.deleteData();

    console.log("Success, DB-Seed created!".rainbow);
  } catch (error) {
    console.log(error);
    console.log("**** DB connection error ****".bgRed);
    process.exit(1);
  }
})();

const MONGODB_CNN = process.env.MONGODB_CNN;
