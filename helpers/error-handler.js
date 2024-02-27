const httpHandler = (error, res = response) => {
  console.log(error);
  return res.status(500).json({ msg: `A ocurrido un error: ${error.message}` });
};

module.exports = {
  httpHandler,
};
