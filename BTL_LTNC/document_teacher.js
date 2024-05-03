var fileUploadInput = document.getElementById('file-upload-input');
var fileNameElement = document.getElementById('file-name');
    fileUploadInput.addEventListener('change', function() {
        if (fileUploadInput.files.length > 0) {
            var fileName = fileUploadInput.files[0].name;
            fileNameElement.textContent = fileName;
        }
    });
    document.querySelector('.header-document .left button').addEventListener('click', function() {
        var content = document.querySelector('.table-document');
        if (content.style.maxHeight !== "0px"){
          content.style.maxHeight = "0px";
        } else {
          content.style.maxHeight = "100vh"; // or any large value
        } 
      });

      import { getDatabase, set, get, update, remove, ref, child }
      from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js"
      import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
      const firebaseConfig = {
        apiKey: "AIzaSyDx8uDOgXaLWzsR5H6autaHqmBoj-Q5m2U",
        authDomain: "ltnc-web.firebaseapp.com",
        projectId: "ltnc-web",
        storageBucket: "ltnc-web.appspot.com",
        messagingSenderId: "819852901117",
        appId: "1:819852901117:web:84832bef50ef4b33e55c94"
      };
    
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);


      const db = getDatabase(app);
      var newInfo = document.querySelector("#InfoBox");
      //Tạo ID infoBox mới
      function newInfoBoxID(dir){
          return new Promise((resolve, reject) => { // Create a new Promise
              let currentID = 1;
              get(ref(db, dir)).then((snapshot) => {
                  if(snapshot.exists()){
                      const iBoxes = snapshot.val();
                      for(let ID in iBoxes){
                          let numericID = parseInt(ID);
                          if(numericID > currentID)
                          {
                              currentID = numericID;
                              console.log("Current ID: " + currentID);
                              console.log("iBox's Value: " + iBoxes[ID]);
                          }
                      }
                      currentID += 1;
                      console.log("New Current ID: " + currentID);
                      resolve(currentID.toString()); // Resolve the Promise with the new ID
                  } else {
                      console.log("Không tìm thấy dữ liệu!");
                      resolve(null);
                  }
              }).catch((error) => {
                  console.error(error);
                  reject(error); // Reject the Promise if there's an error
              });
          });
      }
      
      //Thêm infobox cho lớp học
      //Lấy tham số là mã môn học và mã lớp
      function addInfoBox(course, Class) {
          let dir = "Courses/" + course + "/Classes/" + Class + "/infoBoxes/";
          let iBoxID = newInfoBoxID(dir);
          set(ref(db, dir + iBoxID),{ // Sử dụng ID mới trong đường dẫn
              Info: newInfo.value,
          })
          .then(()=>{
              alert("Đã thêm thông tin thành công!")
          })
          .catch((error)=>{
              alert(error)
          });
      
      }
      
      //Chỉnh sửa infobox cho lớp học
      //Lấy tham số là mã môn học, mã lớp và ID của infoBox
      document.addEventListener('DOMContentLoaded', () => {
        const updateButton = document.getElementById('updateButton');
        if (updateButton) {
            updateButton.addEventListener('click', () => {
                const course = 'CH1003';
                const Class = 'L1';
                const iBoxNeedUpd = '1';
                setInfoBox(course, Class, iBoxNeedUpd);
            });
        }
    });
    



      function setInfoBox(course, Class, iBoxNeedUpd) {
          const infoRef = ref(db, "Courses/" + course + "/Classes/" + Class + "/infoBoxes/" + iBoxNeedUpd);
          const data = {
              Info: newInfo.value,
          };
          update(infoRef, data)
          .then(() => {
          alert("Cập nhật thông tin thành công!");
          })
          .catch((error) => {
          console.error('Error updating data: ', error);
          });
      }
      
      
      //Xóa infobox
      //Lấy tham số là mã môn học, mã lớp và ID của infoBox
      function deleteInfoBox(course, Class, iBox2Del) {
          const infoRef = ref(db, "Courses/" + course + "/Classes/" + Class + "/infoBoxes/" + iBox2Del);
          remove(infoRef).then(() => {
              alert("Xoá thành công ô thông tin!");
              console.log("Remove succeeded.");
          }).catch((error) => {
              console.error("Remove failed: ", error);
          });
      }
      
      //Truy xuất infoBox
      //Lấy tham số là mã môn học và mã lớp
      function getInfo(course, Class) {
          let dir = "Courses/" + course + "/Classes/" + Class + "/infoBoxes/";
      
          var iBoxesArray;
          get(ref(db, ref)).then((snapshot) => {
              if(snapshot.exists()){
                  //Trên tinh thần lớp sẽ lưu danh sách ID học sinh, từ đó truy xuất trong database
                  let iBoxList = snapshot.val();
                  for(let iBox in iBoxList){
                      iBoxesArray.push(iBoxList[iBox]);
                  }
                  //Tạm thời trả về array lưu nội dung infoBox, tùy theo yêu cầu Frontend sẽ chỉnh lại
                  return iBoxesArray;
              } else {
                  console.log("Không tìm thấy dữ liệu!");
                  //Tạm thời trả về array rỗng, tùy theo yêu cầu Frontend sẽ chỉnh lại
                  return iBoxesArray;
              }
          }).catch((error) => {
              console.error(error);
          });
      }