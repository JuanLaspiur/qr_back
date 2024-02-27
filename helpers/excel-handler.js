const xlsx = require("xlsx");

const excelToJson = (file) => {
  try {
    const workBook = xlsx.read(file.data, {
      type: "buffer",
    });
    const sheetName = workBook.SheetNames[0];
    const sheet = workBook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);
    return jsonData;
  } catch (error) {
    console.log(error);
    throw new Error("Error al leer el archivo .xlsx");
  }
};

module.exports = { excelToJson };
