const db=require('../config/connection')

module.exports = {
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
                    .find({ AdmissionNo: data })
                    .toArray();
               console.log("userinfo passed");
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

     getRoomInfo: () => {
          return new Promise(async (resolve, reject) => {
               let roomList = await db
                    .get()
                    .collection("roomInfo")
                    .find()
                    .toArray();
               if (roomList.length === 0) {
                    reject("No rooms found");
               } else {
                    resolve(roomList);
               }
          });
     },

     //update room info

     createRoomInfo: (body) => {
          return new Promise(async (resolve, reject) => {
            let RoomNumber=body.RoomNo;
                    let rooms=await db.get().collection('roomInfo').findOne({RoomNo:RoomNumber});
                    if(rooms) {
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
     UpdateGeneralInfo: (body) => {
        return new Promise(async (resolve, reject) => {
                    console.log(body)
                
                      db.get().collection('hostelInfo') .updateOne(
                         {},
                         { $set: {  
                              TotalFloors:body.TotalFloors,
                              StudyRoom:body.StudyRoom,
                              Mess:body.Mess 
                         } }
                    )                       

                       resolve("general info updated")
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
                         var availableBeds = roomList.AvailableBeds-1;
                         

               db.get()
                    .collection("roomInfo")
                    .updateOne(
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
     },
};