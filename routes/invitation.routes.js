const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields, validateJWT, validateFile } = require("../middlewares");
const { eventExist, invitationExist } = require("../helpers");

const { invitation: controller } = require("../controllers");

const router = Router();

router.post(
  "/",
  [
    validateJWT,
    check("event", "No es un ID válido").isMongoId(),
    check("event", "El evento no existe").custom(eventExist),
    check("event", "Ya esta invitado").custom(invitationExist),
    check("name", "Nombre es obligatorio, Solo letras").isAlpha(),
    check("lastname", "Apellido obligatorio").isAlpha(),
    check("email", "Email es obligatorio").isEmail(),
    validateFields,
  ],
  controller.invitationPost
);

router.post(
  "/excel/:id",
  [validateJWT, validateFile, validateFields],
  controller.invitationMasivePost
);

router.get(
  "/:id",
  [
    validateJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id", "No existe el evento").custom(eventExist),
    validateFields,
  ],
  controller.guestGet
);

/*router.put(
  "/confirm/:event/:email",
 // [
   // validateJWT,
   // check("event", "No es un ID válido").isMongoId(),
    //check("event", "El evento no existe").custom(eventExist),
    //validateFields,
  //],
  controller.invitationPut
); 
*/
router.put('/', controller.invitationPut);
module.exports = router;
