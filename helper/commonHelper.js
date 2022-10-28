const db=require('../config/connection')

module.exports={
    getImageGallery:()=>{
        return new Promise(async(resolve,reject)=>{
            let imageGallery=await db.get().collection('imageGallery').find().toArray();
            resolve(imageGallery);
        })
    
    },



    getAnnouncement:()=>{
        return new Promise(async(resolve,reject)=>{
            let announcementArray=await db.get().collection('announcement').find().toArray();
            console.log('announcement passed')
            resolve(announcementArray);
        })
    },


    getEvents:()=>{
        return new Promise(async(resolve,reject)=>{
            let eventArray=await db.get().collection('events').find().toArray();
            console.log('announcement passed')
            resolve(eventArray);
        })
    },

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
        else if(user.Password !==null)
        {
            err="user already exist"
            reject(err)
        }
        resolve(user);
       }


    })
   },

   updatePassword:(password,user)=>{


    return new Promise(async(resolve,reject)=>{
        await db.get().collection('userInfo').updateOne({AdmissionNo:user},{$set:{Password:password}}).then(()=>{
            resolve("password Updated")
        })


    })

   }





}