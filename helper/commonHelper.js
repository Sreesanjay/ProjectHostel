const db=require('../config/connection')
const bcrypt=require('bcrypt')
module.exports={

    //request for images for image gallery
    getImageGallery:()=>{
        return new Promise(async(resolve,reject)=>{
            let imageGallery=await db.get().collection('imageGallery').find().toArray();
            resolve(imageGallery);
        })
    
    },


    //request for announcement data

    getAnnouncement:()=>{
        return new Promise(async(resolve,reject)=>{
            let announcementArray=await db.get().collection('announcement').find().toArray();
            console.log('announcement passed')
            resolve(announcementArray);
        })
    },

  //request for events
    getEvents:()=>{
        return new Promise(async(resolve,reject)=>{
            let eventArray=await db.get().collection('events').find().toArray();
            console.log('announcement passed')
            resolve(eventArray);
        })
    },

    //storing admission details
    storeAdmissionDetails:(userData)=>{

        return new Promise(async(resolve,reject)=>{
        userData.AdmissionStatus=false;
        console.log(userData);
        db.get().collection('userInfo').insertOne(userData).then((data)=>{
           resolve(data.insertedId)
        });
    })

    },

    //request for user info by email address
   getUserInfoByEmail:(email)=>{
    console.log(email)
    return new Promise(async(resolve,reject)=>{
        let user=await db.get().collection('userInfo').findOne({eMail:email});
        console.log(user)
       if(user==null)
       {
        err="user not found"
        reject(err)
       }
       else{
        if(user.AdmissionStatus===false){
            err="user admission status false"
            reject(err)
        }
        else if(user.Password ==null)
        {
            resolve(user);
        }
        else{
        err="user already exist"
            reject(err)
        }
        
       }


    })
   },


   //request for password updation
   updatePassword:(body,user)=>{

    return new Promise(async(resolve,reject)=>{
        body.Password=await bcrypt.hash(body.Password,10)
        console.log("password is"+body.Password)
        await db.get().collection('userInfo').updateOne({AdmissionNo:user.AdmissionNo},{$set:{Password:body.Password}}).then(()=>{
            resolve("password Updated")
        })


    })

   },

//    request for login

  doLogin:(userData) => {
    var status=false;
        var response={};
    return new Promise(async(resolve,reject)=>{
     let user=await db.get().collection('userInfo').findOne({eMail:userData.eMail});
     if(user){
         bcrypt.compare(userData.Password,user.Password).then((status)=>{
            if(status){
                response.user=user;
                response.status=true;
                resolve(response);
            }
            else{
                response.status=false;
                response.err="password not matched";
                resolve(response);
            }
        })

     }
     else{
        response.status=false;
        response.err="User not found";
        resolve(response);
     }
    })

  },


//storing common peoples queries 

storeMailes:(data)=>{
     return new Promise((resolve, reject)=>{
     db.get().collection('userQuery').insertOne(data).then((status)=>{
        if(status){
            resolve()
        }
     })
    })
}










}