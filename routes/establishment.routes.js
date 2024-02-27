const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields, validateJWT, isAdminRole } = require('../middlewares');

const { establishmentExist } = require('../helpers');
const { establishment: controller } = require('../controllers');

const router = Router();

router.post(
  '/',
  [
    validateJWT,
    isAdminRole,
    check('name', 'Nombre obligatorio').not().isEmpty(),
    check('type', 'Tipo obligatorio').not().isEmpty(),
    validateFields,
  ],
  controller.establishmentPost,
);

router.get('/', [validateJWT, validateFields], controller.establishmentGet);

router.put(
  '/:id',
  [
    validateJWT,
    check('id', 'No es ID válido').isMongoId(),
    check('id', 'No existe el evento').custom(establishmentExist),
    check('name', 'Nombre obligatorio').not().isEmpty(),
    check('type', 'Tipo obligatorio').not().isEmpty(),
    validateFields,
  ],
  controller.establishmentPut,
);

router.delete(
  '/:id',
  [
    validateJWT,
    isAdminRole,
    check('id', 'No es ID válido').isMongoId(),
    check('id', 'No existe el evento').custom(establishmentExist),
    validateFields,
  ],
  controller.establishmentDelete,
);

module.exports = router;
