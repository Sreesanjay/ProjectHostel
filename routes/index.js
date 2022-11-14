var express = require('express');
var router = express.Router();
var adminHelper=require('../helper/adminHelper')
var commonHelper=require('../helper/commonHelper')

const verifyLogin=(req,res,next) => {
  if(req.session.logedIn){
    next();
  }
  else{
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  let user=req.session.user
  let loginStatus=req.session.logedIn
  let userId=req.session.userId;
  if(req.session.messageAlert){
    console.log("message alert got")
    var messageAlert =req.session.messageAlert
  }
  
  commonHelper.getAnnouncement().then((announcement) => {
  res.render('common/index', {admin:false,announcement,user,loginStatus,userId,messageAlert});
  delete req.session.messageAlert;
 })  
});

//receive get request for admit mail
router.get('/mail',(req,res)=>{
res.render('Student/mail')
})


//to redirect to home page
router.get('/redirecToHome',(req, res, next) => {
  res.redirect('/')
});

//request for gallery
router.get('/gallery', function(req, res, next) {

  let user=req.session.user
  let loginStatus=req.session.logedIn
  let userId=req.session.userId;

  commonHelper.getImageGallery().then((imageGallery) => {
    res.render('common/gallery', { imageGallery,title: 'Boys hostel' ,user,loginStatus,userId});
})

});

//request for login page

router.get('/login', function(req, res, next) {

  
  let user=req.session.user
  let loginStatus=req.session.logedIn
  let userId=req.session.userId;

  let err= req.session.err
  if(req.session.logedIn){
  res.redirect('/')
  }
  else{
    res.render('common/login-page',{err,user,loginStatus,userId});
  }
});
//request for signup  page

router.get('/signup',(req, res, next) => {
  let user=req.session.user
  let loginStatus=req.session.logedIn
  let userId=req.session.userId;
  res.render('common/signup',{user,loginStatus,userId})

})




//request for event
router.get('/events',(req,res)=>{

  commonHelper.getEvents().then((events) => {
    
    let user=req.session.user
    let loginStatus=req.session.logedIn
    let userId=req.session.userId;

    res.render('common/events', {common:true, events,title: 'Boys hostel' ,user,loginStatus,userId});
})
})


//---------------------admission process --------------------

//request for admission-form
router.get('/admission-form', function(req, res, next) {
  let user=req.session.user
  let loginStatus=req.session.logedIn
  let userId=req.session.userId;
   res.render('Common/admission-form', {commonUser:true, title: 'admission-form' ,user,loginStatus,userId});
 });

 //post request for admission form

 router.post('/admissionForm',(req,res)=>{
  commonHelper.storeAdmissionDetails(req.body).then((insertId )=> {
    console.log(insertId);
    let image=req.files.userImage;
    image.mv('./public/UserImages/'+insertId+'.jpg',(err,done)=>{
         if(!err){
          res.render('common/index')
         }else{
              console.log(err);
         }
     
     
  })
});
})



//------------------------admission process end------------------------


// post request to signup page
router.post('/signup',(req, res)=>{
  
 commonHelper.getUserInfoByEmail(req.body.eMail).then((userInfo) => {
   console.log("user got")
   commonHelper.updatePassword(req.body,userInfo).then(()=>{
    console.log("password updated")
    res.redirect('/login')
   })
 }).catch((error) => {
  console.log(error)
  res.render('common/signup',{error:error})
 })
  
})

//post request for login

router.post('/login',(req,res)=>{
  
  if(req.session.logedIn){
    res.redirect('/')
  }
  else{
commonHelper.doLogin(req.body).then((response)=>{
  
  if(response.status){
    req.session.logedIn=true;
    req.session.user=response.user;
    req.session.userId=response.user._id;
    req.session.messageAlert={
      message:"Login Success",
      type:true
    }
    
    res.redirect('/')
  }
  else{
    req.session.status=response.status;
    req.session.err=response.err;
    res.redirect('/login')
  }
})
   
} 
});

//request for logout
router.get('/logout',(req,res)=>{
  console.log("user logged out")
  req.session.destroy()
  res.redirect('/')

})


module.exports = router;
