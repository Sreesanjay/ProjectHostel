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
               let userArray = await db
                    .get()
                    .collection("userInfo")
                    .find()
                    .toArray();
               console.log("userinfo passed");
               resolve(userArray);
          });
     },

     //request for room information

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
                        console.log("update start");
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
                              AvailablBeds:3
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


     UpdateGeneralInfo: (body) => {
        return new Promise(async (resolve, reject) => {
                    db.get().collection('hostelInfo').drop().then((data) => {
                        if(data){
                            console.log("Room droped")
                        }
                    })
                      db.get().collection('hostelInfo').insertOne({
                        TotalFloors:body.TotalFloors,
                        StudyRoom: body.StudyRoom,
                        Mess: body.Mess
                       }).then((data) => {
                          if(data){
                              resolve("hostel information updated");
                          }
                          else{
                              reject("Updation failed")
                          }
                       })
        });
   },

     updateRoomInfo: (RoomNo) => {
          return new Promise(async (resolve, reject) => {
               let roomList = await db.get().collection("roomInfo").findOne({ RoomNo:RoomNo });
               console.log(roomList);

               if (roomList) {
                    if (roomList.AvailableBeds == 0) {
                         reject("Room Full");
                    } else {
                         var availableBeds = roomList.AvailableBeds - 1;
                    }
               } else {
                    var availableBeds = 2;
               }

               db.get()
                    .collection("roomInfo")
                    .updateOne(
                         { RoomNumber: RoomNo },
                         { $set: { AvailableBeds: availableBeds } }
                    );
               let status = true;
               resolve(status);
          });
     },

     //update admission status

     admissionStatusUpdate: (data, RoomNo) => {
          return new Promise(async (resolve, reject) => {
               db.get()
                    .collection("userInfo")
                    .updateOne(
                         { AdmissionNo: data },
                         { $set: { AdmissionStatus: true } }
                    );
               db.get()
                    .collection("userInfo")
                    .updateOne(
                         { AdmissionNo: data },
                         { $set: { RoomNumber: RoomNo } }
                    );
               console.log("admission status true");
               resolve("Student admitted");
          });
     },
};