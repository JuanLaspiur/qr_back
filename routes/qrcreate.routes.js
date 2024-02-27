
const express = require('express');
const router = express.Router();
const {qrcreate : controller } = require("../controllers");

router.get('/', (req, res) => {
  controller.get(req, res)
});


module.exports = router;
