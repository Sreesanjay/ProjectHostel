var express = require('express');
var router = express.Router();

var adminHelper=require('../helper/adminHelper')

/* GET users listing. */
router.get('/',(req,res)=>{
    
  adminHelper.getUserInfo().then((userData)=> {
    console.log('userData passed')
    res.render('admin/userInfo',{userData,admin:true})

  })
})

//press go back from user details and redirecting to all user info
router.get('/userInfo',(req,res)=>{
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

//retriving admission list for admin

router.get('/admissionList', function(req, res, next) {
  adminHelper.getAdmissionList().then((userData) => {
    console.log(userData);
    res.render('admin/admissionList', {userData,admin:true,title: 'Boys hostel' });
})
  
});

//request for getting admission list full view of a person
 router.post('/userInfo', function(req, res, next) {
 
   console.log(req.body.adNo)
   adminHelper.getUserInfoByAdmissionNo(req.body.adNo).then((userData) => {
    res.render('admin/admissionListFullDetails', {userData,title: 'Boys hostel' });
  })
  
 });

//get request for viewing user details full view
 router.post('/userDetails',(req,res)=>{
  
    
  adminHelper.getUserInfoByAdmissionNo(req.body.adNo).then((userData)=> {
    res.render('admin/UserDetails',{userData})

  })
})
//announcement post
router.post('/announcement', function(req, res, next){

console.log('announcement post get');
  adminHelper.storeAnnouncement(req.body, (data) => {
   res.send('announcement stored in db')
   console.log(data);
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
  
//request for room info for admitting students

router.post('/viewRoomInfo',(req,res)=>{
  req.session.admissionNumber=req.body.adNo;
  adminHelper.getRoomInfo().then((RoomInfo)=>{
  res.render('admin/RoomInfo',{admin:true,RoomInfo,title: 'Boys hostel' })
  })
})

  // getting admit request


router.post('/admitStudent', function(req, res){

  adminHelper.updateRoomInfo(req.body.RoomNo).then((status)=>{
    if(status){
      console.log("room info updated")

    adminHelper.admissionStatusUpdate( req.session.admissionNumber,req.body.RoomNo,).then((message)=>{
    
      adminHelper.getAdmissionList().then((userData) => {
        req.session.admissionNumber.destroy();
        res.render('admin/admissionList', {userData,admin:true,title: 'Boys hostel' });
    })
      
      
   })
  }

  }).catch((message) => {
    adminHelper.getAdmissionList().then((userData) => {
    res.render('admin/admissionList', {msg:true,message,userData,admin:true,title: 'Boys hostel' });
    })

  })
 
  
  })




/* GET home page. */
router.get('/', function(req, res, next) {

  notification="Admission Started";
  res.render('Common/index', { commonUser:true,title: 'Boys hostel',notification });
});

router.get('/gallery', function(req, res, next) {
  res.render('Common/gallery', { commonUser:true,title: 'Gallery' });
});

router.get('/login-page', function(req, res, next) {
  res.render('Common/login-page', {commonUser:true, title: 'Login' });
});

router.get('/admission-form', function(req, res, next) {
  res.render('Common/admission-form', {commonUser:true, title: 'admission-form' });
});

 router.post('/login', function(req, res) {
   console.log('request got')
 })


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
  
  console.log("helloo")
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
