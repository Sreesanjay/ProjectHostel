var express = require("express");
var router = express.Router();
var transporter = require("../helper/nodemailer");
var adminHelper = require("../helper/adminHelper");

/*for checking the user is loged in or not*/
const verifyLogin = (req, res, next) => {
     if (req.session.AdminlogedIn) {
          console.log("verify login");
          next();
     } else {
          res.redirect("/admin/AdminLogin");
          
     }
};

/* get request for adminIndex. */
router.get("/",verifyLogin, (req, res) => {
     /*checking is there any hostelInfo*/
     adminHelper.checkDb().then((hostelInfo) => {
               adminHelper.getUserInfo().then((userData) => {
                    if (req.session.messageAlert) {
                         var messageAlert = req.session.messageAlert;
                    }
                    adminData = req.session.Admin;
                    res.render("admin/adminIndex", { hostelInfo, messageAlert,userData, adminData, admin: true});
                    delete req.session.messageAlert;
               });
          })
          /*if there is no hostel present*/
          .catch(() => {
               /*checking warden prestent or not in db*/
               adminHelper.checkWarden().then(() => {
                    res.render("admin/hostelEmptyErr", { admin: true });
               }).catch(() => {
                     /*if there is no admin then sign up admin*/
                         res.render("admin/Admin-signUp", { admin: true });
                    });
          });
});
/*-----------------------hostel creation process --------------------*/
//post request for admin signup
router.post("/AdminSignup", (req, res) => {
     adminHelper.adminSignup(req.body).then(() => {
          res.redirect("/admin");
     });
});

//get request for creating hostel
router.get("/CreateHostel",verifyLogin,(req, res) => {
     res.render("admin/GeneralHostelInfo",{admin:true})
})

//post request for update/create hostel info
router.post("/GeneralInfo",(req, res) => {
     console.log("general info post got")
     console.log(req.body);
        adminHelper.updateGeneralInfo(req.body).then((GeneralInfo) => {
               console.log("Inserted id is"+GeneralInfo._id)
                  let insertId = GeneralInfo._id;
                  let image = req.files.HostelLogo;
                  image.mv("./public/Logo/" + insertId + ".jpg", (err, done) => {
                       if (!err) {
                       } else {
                            console.log(err);
                       }
                  });
   
                  req.session.generalInfo = GeneralInfo;
                  req.session.messageAlert = {
                       message: "Hostel info updated",
                       type: true,
                  };
                  res.redirect("/admin");
             })
             .catch((error) => {
                  res.redirect("/admin/createHostel");
             });
   });

//get request for updating room and general info
router.get("/updateHostel",verifyLogin, (req, res) => {
     let generalInfo = req.session.generalInfo;
     if( req.session.messageAlert){
         var messageAlert=req.session.messageAlert; 
     }
     res.render("admin/createHostel", { admin: true, generalInfo,messageAlert });
     delete req.session.messageAlert;
});
//post request for create/update room info
router.post("/createRoom", (req, res) => {
     adminHelper.createRoomInfo(req.body).then((message) => {
          req.session.messageAlert = {
               message: message,
               type: true,
          };
               res.redirect("/admin/updateHostel");
          })
          .catch((error) => {
               req.session.messageAlert = {
                    message: "Room info updation failed",
                    type: false,
               };
               res.redirect("/admin/updateHostel");
          });
});



//---------------------hostel creation process ends --------------------//





//get reuest for admin login pages
router.get("/AdminLogin", (req, res) => {
    /*checking is there any warden present in db*/
    adminHelper.checkWarden().then(() => {

     let user = req.session.Admin;
     let err = req.session.err;
     if (req.session.AdminlogedIn) {
          res.redirect("/");
     } else {
          res.render("admin/AdminLogin", { err, user, admin: true });
          delete req.session.err;
     }

     /*if there is no warden warden sign up*/
}).catch(()=>{
     res.render("admin/Admin-signUp", { admin: true });
})
});

//post request for admin login
router.post("/AdminLogin", (req, res) => {
     console.log(req.body);

     if (req.session.logedIn) {
          res.redirect("/admin");
     } else {
          adminHelper.doLogin(req.body).then((response) => {
               if (response.status) {
                    console.log("login success");
                    req.session.AdminlogedIn = true;
                    req.session.Admin = response.user;
                    req.session.AdminId = response.user._id;
                    req.session.messageAlert = {
                         message: "Login Success",
                         type: true,
                    };

                    var mailOptions = {
                         from: "sreesanjay7592sachu@gmail.com",
                         to: req.session.Admin.WardenEmail,
                         subject: "Login success",
                         text: "You have successfully logged in to Admin pannel",
                    };

                    transporter.sendMail(mailOptions, (err, info) => {
                         if (err) {
                              console.log(err);
                              console.log("mail not send");
                         } else {
                              console.log("mail send");
                         }
                    });

                    req.session.messageAlert = {
                         message: "Loged in successfully",
                         type: true,
                    };

                    res.redirect("/admin");
               } else {
                    req.session.status = response.status;
                    req.session.err = response.err;

                    res.redirect("/admin/AdminLogin");
               }
          });
     }

});





//press go back from user details and redirecting to all user info
router.get("/hostelerList",verifyLogin, (req, res) => {
     res.redirect("/admin");
});

//get request announcement
router.get("/announcement",verifyLogin, function (req, res, next) {
     res.render("admin/announcement", { admin: true });
});

//get request for uploading image to gallery
router.get("/img",verifyLogin, function (req, res, next) {
     res.render("admin/galleryUpload", { admin: true });
});

//get request for uploading event
router.get("/eventUp", verifyLogin,function (req, res, next) {
     res.render("admin/eventsUpload", { admin: true });
});

//get request for event description full view
router.get("/eventDescription", verifyLogin,function (req, res, next) {
     res.render("admin/eventDescription", { admin: true });
});

//get request for viewing user details full view
router.get("/userDetails",verifyLogin, (req, res) => {
     let adNo = req.query.adNo;
     console.log("admission no is" + adNo);
     adminHelper.getUserInfoByAdmissionNo(adNo).then((userData) => {
          res.render("admin/UserDetails", {
               userData,
               admin: true,
               title: "Boys hostel",
          });
     });
});
//announcement post
router.post("/announcement", function (req, res, next) {
     console.log("announcement post get");
     adminHelper.storeAnnouncement(req.body, (data) => {
          res.send("announcement stored in db");
     });
});

//gallery image post
router.post("/imgUpload", function (req, res) {
     adminHelper.storeImage(req.body, (insertId) => {
          res.send("image stored in db");

          let image = req.files.Image;
          image.mv(
               "./public/GalleryImage/" + insertId + ".jpg",
               (err, done) => {
                    if (!err) {
                         res.render("admin/add-product");
                    } else {
                         console.log(err);
                    }
               }
          );
     });
});

//event post
router.post("/eventUpload", (req, res) => {
     adminHelper.storeEvents(req.body, (insertId) => {
          res.send("image stored in db");

          let image = req.files.Image;
          image.mv("./public/EventImages/" + insertId + ".jpg", (err, done) => {
               if (!err) {
                    res.render("admin/eventsUpload");
               } else {
                    console.log(err);
               }
          });
     });
});

//-------------------------admission process--------------------------

//retriving admission list for admin

router.get("/admissionList",verifyLogin, function (req, res, next) {
     adminHelper.getAdmissionList().then((userData) => {
          console.log(userData);
          if (req.session.messageAlert) {
               var messageAlert = req.session.messageAlert;
          }

          res.render("admin/admissionList", {
               userData,
               messageAlert,
               admin: true,
               title: "Boys hostel",
          });
          delete req.session.messageAlert;
     });
});

//request for getting admission list full view of a person
router.get("/admissionUserInfo/:adNo",verifyLogin, function (req, res, next) {
     let adNo = req.params.adNo;
     adminHelper.getUserInfoByAdmissionNo(adNo).then((userData) => {
          res.render("admin/admissionListFullDetails", {
               userData,
               title: "Boys hostel",
          });
     });
});

//request for room info for admitting students

router.get("/viewRoomInfo/:adNo",verifyLogin, (req, res) => {
     req.session.admissionNumber = req.params.adNo;
     if (req.session.messageAlert) {
          var messageAlert = req.session.messageAlert;
     }
     adminHelper
          .getHostelInfo()
          .then((Info) => {
               RoomInfo = Info.roomInfo;
               res.render("admin/RoomInfo", {
                    admin: true,
                    messageAlert,
                    RoomInfo,
                    title: "Boys hostel",
               });
          })
          .catch((error) => {
               res.render("admin/createRoomErr", { admin: true });
          });
});
//go back from admitting student from a room
router.get("/roomInfoGoback",verifyLogin, (req, res) => {
     if (req.session.messageAlert) {
          var messageAlert = req.session.messageAlert;
     }
     adminHelper
          .getHostelInfo()
          .then((Info) => {
               RoomInfo = Info.roomInfo;
               res.render("admin/RoomInfo", {
                    admin: true,
                    messageAlert,
                    RoomInfo,
                    title: "Boys hostel",
               });
          })
          .catch((error) => {
               res.render("admin/createRoomErr", { admin: true });
          });
});

// getting admit request

router.get("/admitStudent/:RoomNo", verifyLogin,function (req, res) {
     adminHelper
          .updateRoomInfo(req.params.RoomNo)
          .then((status) => {
               if (status) {
                    console.log("room updated");

                    adminHelper
                         .admissionStatusUpdate(
                              req.session.admissionNumber,
                              req.params.RoomNo
                         )
                         .then((msg) => {
                              console.log("admission status success");

                              req.session.messageAlert = {
                                   message: msg,
                                   type: true,
                              };
                              adminHelper
                                   .getUserInfoByAdmissionNo(
                                        req.session.admissionNumber
                                   )
                                   .then((userData) => {
                                        console.log(
                                             "user data is " + userData.eMail
                                        );
                                        delete req.session.admissionNumber;
                                        //mail
                                        var mailOptions = {
                                             from: "sreesanjay7592sachu@gmail.com",
                                             to: userData.eMail,
                                             subject: "Hostel admission request approved",
                                             text: 'your request for hostel admission has been approved.please click below link to create your login password for hostel website "http://localhost:3000/signup"',
                                        };

                                        transporter.sendMail(
                                             mailOptions,
                                             (err, info) => {
                                                  if (err) {
                                                       console.log(err);
                                                       console.log(
                                                            "mail not send"
                                                       );
                                                  } else {
                                                       console.log("mail send");
                                                  }

                                                  //mail end
                                             }
                                        );
                                        res.redirect("/admin/admissionList");
                                   });
                         })
                         .catch((msg) => {
                              console.log(msg);
                              req.session.messageAlert = {
                                   message: msg,
                                   type: false,
                              };
                              res.redirect("/admin/admissionList");
                         });
               }
          })
          .catch((msg) => {
               req.session.messageAlert = {
                    message: msg,
                    type: false,
               };
               res.redirect("/admin/viewRoomInfo/:adNo");
          });
});
//------------------------admission process end--------------------------------


//

//for viewing hostel info
router.get("/hostelInfo",verifyLogin, (req, res) => {
     adminHelper
          .getHostelInfo()
          .then((Info) => {
               let RoomInfo = Info.roomInfo;
               let GeneralInfo = Info.generalInfo;
               req.session.generalInfo = GeneralInfo;
               res.render("admin/HostelInfo", {
                    admin: true,
                    RoomInfo,
                    GeneralInfo,
               });
          })
          .catch((error, GeneralInfo) => {
               req.session.generalInfo = GeneralInfo;
               res.render("admin/createRoomErr", { admin: true });
          });
});
//clicking hostelInfo link in nav
router.get("/hostelInfoRedirect",verifyLogin, (req, res) => {
     let generalInfo = req.session.generalInfo;
     res.render("admin/HostelInfo", { generalInfo, admin: true });
});



module.exports = router;
