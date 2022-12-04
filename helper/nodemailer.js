//node mailer//
var nodemailer = require('nodemailer');

var mailConfig = {
    service:'gmail',
    auth:{
         user:'sreesanjay7592sachu@gmail.com',
         pass:'zwfqogpzqqiabpnk'
         
    }
  };
  
   var transporter=nodemailer.createTransport(mailConfig);



   
  
   module.exports =transporter;
  
  //
  