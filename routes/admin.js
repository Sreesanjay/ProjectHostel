var express = require('express');
var router = express.Router();

var adminHelper=require('../helper/adminHelper')


const verifyLogin=(req,res,next) => {
  if(req.session.logedIn){
    next();
  }
  else{
    res.redirect('/login')
  }
}



/* GET users listing. */
router.get('/',(req,res)=>{
    
  adminHelper.getUserInfo().then((userData)=> {
    console.log('userData passed')
    res.render('admin/userInfo',{userData,admin:true})

  })
})

//press go back from user details and redirecting to all user info
router.get('/hostelerList',(req,res)=>{
  res.redirect('/admin')
})

//get request announcement
router.get('/announcement', function(req, res, next) {
  res.render('admin/announcement',{admin:true})
});

//get request for uploading image to gallery
router.get('/img', function(req, res, next) {
  res.render('admin/galleryUpload',{admin:true})
});

//get request for uploading event
router.get('/eventUp', function(req, res, next) {
  res.render('admin/eventsUpload',{admin:true})
});

//get request for event description full view
router.get('/eventDescription', function(req, res, next) {
  res.render('admin/eventDescription',{admin:true})
});

//get request for viewing user details full view
 router.get('/userDetails',(req,res)=>{
  let adNo = req.query.adNo;
    console.log("admission no is"+adNo)
  adminHelper.getUserInfoByAdmissionNo(adNo).then((userData)=> {
    res.render('admin/UserDetails',{userData,admin:true,title: 'Boys hostel'})

  })
})
//announcement post
router.post('/announcement', function(req, res, next){

console.log('announcement post get');
  adminHelper.storeAnnouncement(req.body, (data) => {
   res.send('announcement stored in db')
  });

})

//gallery image post
router.post('/imgUpload', function(req, res){

    adminHelper.storeImage(req.body, (insertId) => {
     res.send('image stored in db')

    let image=req.files.Image;
    image.mv('./public/GalleryImage/'+insertId+'.jpg',(err,done)=>{
         if(!err){
              res.render("admin/add-product")
         }else{
              console.log(err);
         }
    });


   });
  
  })


  //event post
  router.post('/eventUpload',(req, res)=>{

    adminHelper.storeEvents(req.body, (insertId) => {
      res.send('image stored in db')
 
     let image=req.files.Image;
     image.mv('./public/EventImages/'+insertId+'.jpg',(err,done)=>{
          if(!err){
               res.render("admin/eventsUpload")
          }else{
               console.log(err);
          }
     });
 
 
    });

  })


  //-------------------------admission process--------------------------

  
//retriving admission list for admin

router.get('/admissionList', function(req, res, next) {
  adminHelper.getAdmissionList().then((userData) => {
    console.log(userData);
   if(req.session.messageAlert){
    var messageAlert =req.session.messageAlert
   }

    res.render('admin/admissionList', {userData,messageAlert,admin:true,title: 'Boys hostel' });
    delete req.session.messageAlert;
})
  
});

//request for getting admission list full view of a person
 router.get('/admissionUserInfo/:adNo', function(req, res, next) {
   let adNo = req.params.adNo
   adminHelper.getUserInfoByAdmissionNo(adNo).then((userData) => {
    res.render('admin/admissionListFullDetails', {userData,title: 'Boys hostel' });
  })
  
 });
  
//request for room info for admitting students

router.get('/viewRoomInfo/:adNo',(req,res)=>{
  req.session.admissionNumber=req.params.adNo;
  if(req.session.messageAlert)
  {
    var messageAlert=req.session.messageAlert
  }
  adminHelper.getRoomInfo().then((RoomInfo)=>{

  res.render('admin/RoomInfo',{admin:true,messageAlert,RoomInfo,title: 'Boys hostel' })
 
  }).catch((error)=>{
    res.render('admin/createRoomErr',{admin:true})
  })
})

  // getting admit request


router.get('/admitStudent/:RoomNo', function(req, res){
  adminHelper.updateRoomInfo(req.params.RoomNo).then((status)=>{
    if(status){
  
    adminHelper.admissionStatusUpdate( req.session.admissionNumber,req.params.RoomNo,).then((msg)=>{
        delete req.session.admissionNumber;
        req.session.messageAlert={
          message:msg,
          type:true
        }
        res.redirect('/admin/admissionList');
 
   }).catch((msg)=>{
    req.session.messageAlert={
      message:msg,
      type:false
    }
    res.redirect('/admin/admissionList');
   })
  }

  }).catch((msg) => {
      req.session.messageAlert={
        message:msg,
        type:false
      }
    res.redirect('/admin/viewRoomInfo/:adNo');
    })
 
  
  })
  //------------------------admission process end--------------------------------


 router.get('/Rooms',(req,res)=>{
  adminHelper.getRoomInfo().then((roomInfo)=>{
    console.log("room info is "+roomInfo)
    res.render('admin/rooms',{admin:true,roomInfo})
  }).catch((error)=>{
    res.render('admin/createRoomErr',{admin:true})
  })
  
 })


//creating room
 router.get('/createRoom',(req,res)=>{
  
  res.render('admin/createRoom',{admin:true})
 })

 router.post('/createRoom',(req,res)=>{
  adminHelper.createRoomInfo(req.body).then((message)=>{
    res.redirect('/admin/createRoom')
  }).catch((error)=>{
    res.redirect('/admin/createRoom')
  })
 })

 router.post('/roomGeneralInfo',(req,res)=>{
  adminHelper.UpdateGeneralInfo(req.body).then((message)=>{
    res.redirect('/admin/createRoom')
  }).catch((error)=>{
    res.redirect('/admin/createRoom')
  })
 })


module.exports = router;
