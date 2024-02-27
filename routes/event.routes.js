const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields, validateJWT, isAdminRole } = require("../middlewares");

const { eventExist } = require("../helpers");
const { event: controller } = require("../controllers");

const router = Router();

router.post(
  "/",
  [
    validateJWT,
    isAdminRole,
    check("name", "Nombre obligatorio").not().isEmpty(),
    check("date", "La fecha no es válida").isISO8601().toDate(),
    check("max", "Cantidad maxima inválida").not().isEmpty().isNumeric(),
    validateFields,
  ],
  controller.eventPost
);

router.get("/", [validateJWT, validateFields], controller.eventGet);

router.put(
  "/:id",
  [
    validateJWT,
    check("id", "No es ID válido").isMongoId(),
    check("id", "No existe el evento").custom(eventExist),
    check("name", "Nombre obligatorio").not().isEmpty(),
    check("date", "La fecha no es válida").isISO8601().toDate(),
    validateFields,
  ],
  controller.eventPut
);

router.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "No es ID válido").isMongoId(),
    check("id", "No existe el evento").custom(eventExist),
    validateFields,
  ],
  controller.eventDelete
);

module.exports = router;
