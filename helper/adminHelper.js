const db=require('../config/connection')
const bcrypt=require('bcrypt')



module.exports = {

     //checking if the db is empty or not for creating hostel
     checkDb:() => {
          return new Promise(async (resolve, reject) => {
               var hostelInfo=await db.get().collection("hostelInfo").findOne();
               if(hostelInfo==null){
                    reject();
               }
               resolve(hostelInfo);
          })
         
          
     },
//storing warden details in db
     adminSignup:(adminData)=>{
          console.log("password is"+adminData.Password)
          return new Promise(async (resolve, reject) => {
               adminData.Password=await bcrypt.hash(adminData.Password,10)
               await db.get().collection("adminInfo").insertOne({
                    WardenName:adminData.WardenName,
                    WardenEmail:adminData.WardenEmail,
                    WardenPassword:adminData.Password
               }).then(() => {
                    resolve()
               })
          })
     },


//    request for login

doLogin:(userData) => {
     var status=false;
         var response={};
     return new Promise(async(resolve,reject)=>{
      let user=await db.get().collection('adminInfo').findOne({WardenEmail:userData.eMail});
      if(user){
          bcrypt.compare(userData.Password,user.WardenPassword).then((status)=>{
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



     checkWarden:()=>{
          return new Promise(async (resolve, reject) => {
               var AdminInfo=await db.get().collection("adminInfo").findOne();
               if(AdminInfo===null){
                    console.log("no admin")
                    reject();
               }
               else{
               console.log("admin found")
               resolve();
               }
          })
     },


     //request for storing announcement

     storeAnnouncement: (announcement, callback) => {
          console.log(announcement);

          db.get()
               .collection("announcement")
               .insertOne(announcement)
               .then((data) => {
                    callback(data);
               });
     },

     //request for storing Event

     storeEvents: (event, callback) => {
          db.get()
               .collection("events")
               .insertOne(event)
               .then((data) => {
                    callback(data.insertedId);
               });
     },

     // request for storing images of  gallery
     storeImage: (image, callback) => {
          console.log(image);

          db.get()
               .collection("imageGallery")
               .insertOne(image)
               .then((data) => {
                    callback(data.insertedId);
               });
     },

     //request for retriving admission list for admin to admit student

     getAdmissionList: () => {
          return new Promise(async (resolve, reject) => {
               let userArray = await db
                    .get()
                    .collection("userInfo")
                    .find({ AdmissionStatus: false })
                    .toArray();
               console.log("userinfo passed");
               resolve(userArray);
          });
     },

     //requset for user full details by admission number
     getUserInfoByAdmissionNo: (data) => {
          return new Promise(async (resolve, reject) => {
               let userArray = await db
                    .get()
                    .collection("userInfo")
                    .findOne({ AdmissionNo: data })
                    
               console.log("userinfo passed"+userArray.eMail);
               resolve(userArray);
          });
     },

     //request for the user info of admitted student
     getUserInfo: () => {
          return new Promise(async (resolve, reject) => {
               let userArray = await db.get().collection("userInfo").find({AdmissionStatus:true}).toArray();
               console.log("userinfo passed");
               resolve(userArray);
          });
     },

     //request for room information for admitting student

     getHostelInfo: () => {
          return new Promise(async (resolve, reject) => {
               let hostelInfo=await db.get().collection("hostelInfo").findOne()
               let roomList = await db.get().collection("roomInfo").find().toArray();
               if (roomList.length === 0) {
                    reject("No rooms found",hostelInfo);
               } else {
                    let Info={
                         generalInfo:hostelInfo,
                         roomInfo:roomList
                    }
                    resolve(Info);
               }
          });
     },

     //update room info

     createRoomInfo: (body) => {
          return new Promise(async (resolve, reject) => {
            let RoomNumber=body.RoomNo;
                    let rooms=await db.get().collection('roomInfo').findOne({RoomNo:RoomNumber});
                    if(rooms) {
                         console.log("room exist")
                        db.get().collection('roomInfo').updateOne({ RoomNo:body.RoomNo},{$set:{
                              RoomNo: body.RoomNo,
                              FloorNo: body.FloorNo,
                              RoomType: body.RoomType,
                              TotalBeds: body.TotalBeds,
                              AttachedBathroom: body.AttachedBathroom
                         }}).then((data) => {
                            if(data){
                                resolve("Room information updated");
                            }
                            else{
                                reject("Updation failed")
                            }
                         })

                    }else{
                         console.log("no room")
                    db.get().collection('roomInfo').insertOne({
                              RoomNo: body.RoomNo,
                              FloorNo: body.FloorNo,
                              RoomType: body.RoomType,
                              TotalBeds: body.TotalBeds,
                              AttachedBathroom: body.AttachedBathroom,
                              AvailableBeds:3
                         })
                         .then((data) => {
                            if(data){
                              resolve("Room created")
                            }
                            else{
                                reject("Room creation failed")
                            }
                         });
                    }
          });
     },


    //updating the general hostel info
     updateGeneralInfo: (body) => {
          return new Promise(async (resolve, reject) => {
               let hostelInfo = await db.get().collection('hostelInfo').findOne();
               if (hostelInfo === null) {
                    db.get().collection('hostelInfo').insertOne({
                         HostelName: body.HostelName,
                         CollageName: body.CollageName,
                         HostelType: body.HostelType,
                         HostelAddress: body.HostelAddress,
                         TotalFloors: body.TotalFloors,
                         StudyRoom: body.StudyRoom,
                         Mess: body.Mess
                    }).then(()=>{
                        db.get().collection('hostelInfo').findOne().then((hostelInfo)=>{
                              resolve(hostelInfo)
                         });
                    }).catch((error)=>{
                         reject(error);
                    })
               }
               else {
                    db.get().collection('hostelInfo').updateOne(
                         {},
                         {
                              $set: {
                                   HostelName: body.HostelName,
                                   CollageName: body.CollageName,
                                   HostelType: body.HostelType,
                                   HostelAddress: body.HostelAddress,
                                   TotalFloors: body.TotalFloors,
                                   StudyRoom: body.StudyRoom,
                                   Mess: body.Mess

                              }
                         }
                    ).then(()=>{
                         db.get().collection('hostelInfo').findOne().then((hostelInfo)=>{
                               resolve(hostelInfo)
                          });
                     }).catch((error)=>{
                          reject(error);
                     })
                    
               }
          });
     },

   //updating the room info after admitting a student(setting available beds-1)

     updateRoomInfo: (RoomNumber) => {
          console.log("room no is:"+RoomNumber)
          return new Promise(async (resolve, reject) => {
               let roomList = await db.get().collection("roomInfo").findOne({RoomNo:RoomNumber });
               console.log(roomList);
                    if (roomList.AvailableBeds == 0) {
                         console.log("room full")
                         reject("Room Full");
                    } else {
                       let bedCount=db.get().collection("userinfo").find({RoomNo:RoomNumber }).count();
                       console.log("total occupied beds are "+bedCount)
                         var availableBeds = roomList.TotalBeds-bedCount;
               db.get().collection("roomInfo").updateOne(
                         { RoomNo: RoomNumber },
                         { $set: { AvailableBeds: availableBeds } }
                    ).then((status) => {
                         if(status){
                              resolve(status);
                         }
                         else{
                              reject("Room allotting failed")
                         }
                    })
               }
          });
     },

     //update admission status of student by setting admission status true and allottinig the room number 

     admissionStatusUpdate: (data, RoomNo) => {
          return new Promise(async (resolve, reject) => {
               db.get()
                    .collection("userInfo")
                    .updateOne(
                         { AdmissionNo: data },
                         { $set: { AdmissionStatus: true,
                                   RoomNo: RoomNo
                         } }
                    ).then((status)=>{
                         if(status){
                              resolve("Student admission success")
                         }
                         else{
                              
                              reject("Student admission failed")
                         }
                    }).catch((err) => {
                        
                         reject(err)
                    })
              
          });
     }
     


};









//

