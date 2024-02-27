require('dotenv').config();
require('colors');
const { FRONT_URL } = process.env;
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { auth, event, user, invitation, establishment, qrcreat } = require('../routes');
const { conn } = require('../config/db');
const { transporter } = require('../config/mails');




class Server {
  constructor() {
    this.app = express();
    this.paths = {
      user: '/api/users',
      auth: '/api/auth',
      event: '/api/event',
      invitation: '/api/invitation',
      establishment: '/api/establishment',
      qrcreate:'/api/qrcreate'
     };

    // DB conn
    this.dbConn();

    // Nodemailer config
    this.emailReady();

    // Middlewares
    this.middlewares();

    // Rutas de la app
    this.routes();

    // Puerto
   this.port = process.env.PORT || 3001; 
  }

  // Coneccion con DB
  async dbConn() {
    await conn();
  }

  emailReady() {
    transporter.verify((err) => {
      if (!err) {
        console.log('App Ready for send emails'.bgGreen);
      } else {
        console.log('Emails bad configuration'.bgRed);
        console.log(err);
      }
    });
  }

  middlewares() {
    // CORS
   this.app.use(cors({ origin: FRONT_URL })); 

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio publico
    this.app.use(express.static('public'));

    // Express-fileUpload
    this.app.use(fileUpload());
  }

  routes() {
    this.app.use(this.paths.auth, auth);
    this.app.use(this.paths.user, user);
    this.app.use(this.paths.event, event);
    this.app.use(this.paths.invitation, invitation);
    this.app.use(this.paths.establishment, establishment);
    this.app.use(this.paths.qrcreate, qrcreat);
   }

  listen() {
    this.app.listen(this.port, () =>
      console.log(`Server listening on port${this.port}`),
    );
  }
}

module.exports = Server; 
