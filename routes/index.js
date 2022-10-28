var express = require('express');
var router = express.Router();
var adminHelper=require('../helper/adminHelper')
var commonHelper=require('../helper/commonHelper')

<<<<<<< HEAD
/* GET home page. */
router.get('/', function(req, res, next) {

commonHelper.getAnnouncement().then((announcement) => {
  res.render('common/index', {admin:false,announcement });
 })

 
    
});


//to redirect to home page
router.get('/redirecToHome',(req, res, next) => {
  res.redirect('/')
});

//request for gallery
router.get('/gallery', function(req, res, next) {

  commonHelper.getImageGallery().then((imageGallery) => {
    res.render('common/gallery', { imageGallery,title: 'Boys hostel' });
})

});

//request for login page

router.get('/login-page', function(req, res, next) {
 
  res.render('common/login-page', { title: 'Login' });
});
//request for signup  page

router.get('/signup',(req, res, next) => {
  res.render('common/signup')

})

//request for admission form


router.get('/admission-form', function(req, res, next) {
  res.render('common/admission-form', { title: 'admission-form' });
});
=======
// /* GET home page. */
// router.get('/', function(req, res, next) {

//   notification="Admission Started";
//   res.render('Common/index', { commonUser:true,title: 'Boys hostel',notification });
// });

// router.get('/gallery', function(req, res, next) {
//   res.render('Common/gallery', { commonUser:true,title: 'Gallery' });
// });

// router.get('/login-page', function(req, res, next) {
//   res.render('Common/login-page', {commonUser:true, title: 'Login' });
// });
>>>>>>> master

// router.get('/admission-form', function(req, res, next) {
//   res.render('Common/admission-form', {commonUser:true, title: 'admission-form' });
// });

//  router.post('/login', function(req, res) {
//    console.log('request got')
//  })

//request for event
router.get('/events',(req,res)=>{

  commonHelper.getEvents().then((events) => {
    
    res.render('common/events', { events,title: 'Boys hostel' });
})
})


// post request to signup page
router.post('/signup',(req, res)=>{
  
 commonHelper.getUserInfoByEmail(req.body.eMail).then((userInfo) => {
   console.log("user got")
   commonHelper.updatePassword(req.body.Password,userInfo.AdmissionNo).then(()=>{
    console.log("password updated")
   })
 }).catch((error) => {
  console.log(error)
  res.render('common/signup',{error:error})
 })
  
})

//post request for login

router.post('/login',(req,res)=>{

  adminHelper.getAdmissionList().then((userList) => {
    
    for(let i=0;i<userList.length;i++) {
      if(userList[i].AdmissionStatus){
      if(req.body.email === userList[i].eMail&&req.body.password === userList[i].password){

        res.render('common/index', {title: 'Boys hostel' });
      }
    }
  }
    
})
})


module.exports = router;
