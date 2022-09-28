const { Router } = require("express");
const { check } = require("express-validator");
const { crearUsuario, loginUsuario,  revalidarToken } = require("../controllers/auth.controller");
const { validarJWT } = require("../helpers/validar-jwt");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

// Crear un nuevo usuario
// cuando entre al /new ejecutara el callback crearUsuario
router.post('/new', [

    check('name', 'El username es obligatorio').notEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contrasenia es obligatoria').isLength({ min: 6}),
    // custom middleware
    validarCampos

], crearUsuario);

// Login de usuario
router.post( '/', [
    // primero ejecuta todo este arreglo de middlewares y
    //despues ejecuta todo el controlador
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contrasenia  es obligatoria').isLength({min:6}),
    // custom middleware
    validarCampos

], loginUsuario);

// Valida y revalidar token
router.get("/renew", validarJWT, revalidarToken);

// Exportando
module.exports = router;

