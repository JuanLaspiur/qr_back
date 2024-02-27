const { Router } = require('express');
const { check } = require('express-validator');

const { user: controller } = require('../controllers');

const { validateFields, validateJWT, isAdminRole } = require('../middlewares');
const { passCheck, userByIdExist } = require('../helpers');

const router = Router();

router.get('/', [validateJWT, isAdminRole, validateFields], controller.getAll);
router.post(
  '/',
  [check('email', 'No es un email valido').isEmail(), validateFields],
  controller.create,
);
router.put(
  '/:id',
  [
    validateJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(userByIdExist),
    //check("password", "Contraseña incorrecta").custom(passCheck),
    check('name', 'Nombre obligatorio').not().isEmpty(),
    check('email', 'Debes introducir un email válido').isEmail(),
    check(
      'lastname_father',
      'Debes introducir almenos un apellido válido',
    ).isAlpha(),
    check('lastname_mother', 'Apellido materno no es válido').isAlpha(),
    check('id', 'ID es obligatorio').not().isEmpty(),
    validateFields,
  ],
  controller.update,
);
router.get(
  '/:id',
  [
    validateJWT,
    isAdminRole,
    check('id', 'ID es obligatorio').not().isEmpty(),
    check('id', 'El ID invalido').isMongoId(),
    validateFields,
  ],
  controller.getById,
);
router.delete('/:id', [validateJWT, validateFields], controller.delete);

module.exports = router;
