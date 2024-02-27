const { readFileSync } = require("fs");
const path = require("path");
const { compile } = require("handlebars");

module.exports = {
  generateTemplateHtml: () => {
    const sourcePath = path.join(__dirname, "..", "emails/qr.hbs");
    const source = readFileSync(sourcePath, "utf-8");
    return compile(source);
  },
};
