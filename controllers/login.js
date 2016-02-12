var tiempo = require('../routes/tiempo.js');
var schema = require("../models/users.js");
var EstadisticaSemana = require('../routes/estadisticaSemana.js');
var EstadisticaHora = require('../routes/estadisticaHora.js');
var EstadisticaAnual = require('../routes/estadisticaAnual.js');
var md5 = require('md5');
var Ficheroradiacion = require("../routes/radiacion.js");


exports.login = function(req, res) {
 //--------------------------------------------------------comprobar la session en el login
 if (req.session.a) {
  schema.findOne({
   'usuario': req.session.a
  }, function(err, user) {

    if (user.confirmado == '1') {
     req.session.a = user.usuario;

     if (user.admin == "1") {
      console.log("admin entrando...");

      res.redirect('/admin');
     }
     else {
      var fototipo = user.fototipo;

      if (user.dispositivo == null || user.dispositivo == "") {
       req.session.dispositivo = "ML8511";
       console.log("dispositivo estandar " + req.session.dispositivo);
       Ficheroradiacion.mostrar(req, res, fototipo);
      }
      else {

       req.session.dispositivo = user.dispositivo;
       console.log("dispositivo personal " + req.session.dispositivo);
       Ficheroradiacion.mostrar(req, res, fototipo);
      }
     }
    }


    else {
     console.log('no confirmado');
     res.render('index', {
      error3: "confirma el emailaso"

     });
    }

   

  });
 }
 //--------------------------------------------------------logearse 
 else {

  tiempo.recogertiempo(req, res);

  var emailL = req.body.email;
  var passL = req.body.pass;
  var passh2 = md5(passL);


  schema.findOne({
   'email': emailL,
   'pass': passh2
  }, function(err, user) {

   if (!user) {
    console.error("email o contraseña incorrecta :D");
    res.render('index', {
     error4: "email o contraseña incorrecta :D"

    });


   }
   else {

    if (user.confirmado == '1') {
     req.session.a = user.usuario;

     if (user.admin == "1") {
      console.log("admin entrando...");

      res.redirect('/admin');
     }
     else {


      var fototipo = user.fototipo;



      if (user.dispositivo == null || user.dispositivo == "") {
       req.session.dispositivo = "ML8511";
       console.log("dispositivo estandar " + req.session.dispositivo);
     //  Ficheroradiacion.mostrar(req, res, fototipo);
       res.redirect("/home");
      }
      else {

       req.session.dispositivo = user.dispositivo;
       console.log("dispositivo personal " + req.session.dispositivo);
      // Ficheroradiacion.mostrar(req, res, fototipo);
       res.redirect("/home");
      }
     }
    }


    else {
     console.log('no confirmado');
     res.render('index', {
      error3: "confirma el emailaso"

     });
    }

   }

  });
 }
};

exports.logout = function(req, res) {
 req.session.destroy();
 console.log("Sesión destruida");
 res.redirect('/');
};