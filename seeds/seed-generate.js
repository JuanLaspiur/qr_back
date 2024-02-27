require("colors");
const { connect } = require("mongoose");
const seedUsers = require("./user.seed");
const seedRoles = require("./role.seed");

const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const MONGODB_CNN = process.env.MONGODB_CNN;

(async () => {
  try {
    await connect(MONGODB_CNN);

    console.log("**** DB connected ****".bgGreen + "\n");

    await seedUsers.importData();
    await seedRoles.importData();

    console.log("Success, DB-Seed created!".rainbow);

    process.exit(0);
  } catch (error) {
    console.error(error);
    console.log("**** DB connection error ****".bgRed);

    process.exit(1);
  }
})();
