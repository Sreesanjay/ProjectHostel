const db=require('../config/connection')

module.exports={
    //announcement start

storeAnnouncement:(announcement,callback)=>{
console.log(announcement);

db.get().collection('announcement').insertOne(announcement).then((data)=>{

    callback(data);

});
},
//announcement end

//Event section

storeEvents:(event,callback)=>{
    db.get().collection('events').insertOne(event).then((data)=>{
    
        callback(data.insertedId);
    
    });
    },

    
//Event section end

//image gallery start
storeImage:(image,callback)=>{
    console.log(image);
    
    db.get().collection('imageGallery').insertOne(image).then((data)=>{
       
    
        callback(data.insertedId);
    
    });
    },


    //image gallery end

    
//admission start

//storing admission details
     storeAdmissionDetails:(userData)=>{

        return new Promise(async(resolve,reject)=>{
        userData.AdmissionStatus=false;
        console.log(userData);
        db.get().collection('userInfo').insertOne(userData).then((data)=>{
           resolve(data)
        });
    })

    },


    
    getAdmissionList:()=>{
        return new Promise(async(resolve,reject)=>{
            let userArray=await db.get().collection('userInfo').find({AdmissionStatus:false}).toArray();
            console.log('userinfo passed')
            resolve(userArray);
        })
    },
    getUserInfoByAdmissionNo:(data)=>{
        // console.log("admission no is"+data)
         return new Promise(async(resolve,reject)=>{
             let userArray=await db.get().collection('userInfo').find({AdmissionNo:data}).toArray()
          console.log('userinfo passed')
             resolve(userArray);
         })
    },
    getUserInfo:()=>{
        return new Promise(async(resolve,reject)=>{
            let userArray=await db.get().collection('userInfo').find().toArray();
            console.log('userinfo passed')
            resolve(userArray);
        })
    },

//admission end
//update admission status

admissionStatusUpdate:(data)=>{

    return new Promise(async(resolve,reject)=>{
     db.get().collection('userInfo').updateOne({AdmissionNo:data},{$set:{AdmissionStatus:true}})
     console.log('admission status true')
     resolve("admission status true")
    })

},







}