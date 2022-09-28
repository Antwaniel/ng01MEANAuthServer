const { response } = require("express");
const Usuario = require("../models/Usuario.js");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt.js");

// peticion post para crear nuevo usuarop
// A esto sele conoce como callback del controlador
const crearUsuario = async (req, res = response) => {
  const { email, name, password } = req.body;
  //console.log(email, name, password);

  try {
    // Verificar el email
    const usuario = await Usuario.findOne({ email: email });

    if (usuario) {
      // status 400: badRequest
      return res.status(400).json({
        ok: false,
        msg: "El usuario ya existe con ese email",
      });
    }

    // Crear usuario con el Modelo
    const dbUser = new Usuario(req.body);

    // Encriptar contrasenia
    // Aleatoriedad con salt: 10 vueltas
    const salt = bcrypt.genSaltSync();
    dbUser.password = bcrypt.hashSync(password, salt);

    // Generar el JsonWebToken
    const token = await generarJWT(dbUser.id, dbUser.name);

    // Crear el usuario de DB
    dbUser.save();

    // Generar Respuesta exitosa
    return res.status(200).json({
      ok: true,
      udi: dbUser.id,
      name,
      token,
    });
  } catch (error) {
    // 500 error interno del servidor
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  // console.log(email, password);
  try {
    const dbUser = await Usuario.findOne({ email: email });

    if (!dbUser) {
      return res.status(400).json({
        ok: false,
        msg: "El correo no existe",
      });
    }

    // Confirmar si el password hace match
    const validPassword = bcrypt.compareSync(password, dbUser.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "La contrasenia es invalida",
      });
    }

    // Generar el JWT
    const token = await generarJWT(dbUser.id, dbUser.name);

    // Respuesta del servicio
    return res.json({
      ok: true,
      uid: dbUser.id,
      name: dbUser.name,
      token,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok: false,
      msg: "Hable con el admin",
    });
  }
};

const revalidarToken = async(req, res = response) => {

  const {uid, name} = req;

  // generar un nuevo jwt
  const token = await generarJWT(uid, name);
  
  return res.json({
    ok: true,
    uid,
    name,
    token
  });
};

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
};
