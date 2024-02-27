const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields } = require("../middlewares");

const { auth } = require("../controllers");

const router = Router();

router.post(
  "/login",
  [
    check("email", "Email Obligatorio / Invalido").not().isEmpty().isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    validateFields,
  ],
  auth.login
);

module.exports = router;
