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
      document.querySelector('.container-upload .box-p button').addEventListener('click', function() {
        var content = document.querySelector('.box-file-upload');
        var currentOpacity = window.getComputedStyle(content).getPropertyValue("opacity");
        if (currentOpacity !== "0"){
          content.style.maxHeight = "0px";
          content.style.opacity = "0";
          content.style.visibility = "hidden";
        } else {
          content.style.maxHeight = "100vh"; // or any large value
          content.style.opacity = "1";
          content.style.visibility = "visible";
        } 
    });
    
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);

      const db = getDatabase(app);
      
// -----------------------------Hàm hiển thị thông tin lớp lên header---------------------------------
      document.addEventListener('DOMContentLoaded', function () {
        // Lấy tham số từ URL
        const urlParams = new URLSearchParams(window.location.search);
        const courseID = urlParams.get('courseID');
        const classID = urlParams.get('classID');
      
        const SubjectIDElement = document.getElementById('header-NameSubject');
        const cousreRef = ref(db, "Courses/" + courseID + "/Course_Title");
        get(cousreRef).then((snapshot) => {
          const Subject_name = snapshot.val();
          SubjectIDElement.innerHTML = courseID + '_' + Subject_name + '_' + classID;
        })
      
        // Hiển thị dặn dò của giảng viên
        for (let i = '1'; i <= '3'; i++) {
          displayInfoBox(courseID, classID, i);
        }
        // lấy dữ liệu từng hộp
        const updateButton1 = document.getElementById('updateButton1');
        if (updateButton1) {
            updateButton1.addEventListener('click', () => {
                setInfoBox(courseID, classID, '1');
            });
        }
        const updateButton2 = document.getElementById('updateButton2');
        if (updateButton2) {
            updateButton2.addEventListener('click', () => {
                setInfoBox(courseID, classID, '2');
            });
        }
        const updateButton3 = document.getElementById('updateButton3');
        if (updateButton3) {
            updateButton3.addEventListener('click', () => {
                setInfoBox(courseID, classID, '3');
            });
        }
      });

// ----------------------------------Hàm hiển thị dặn dò (vẫn cần update)-------------------------------------------------
    function displayInfoBox(course, Class, iBoxNeedUpd) {
        const infoRef = ref(db, "Courses/" + course + "/Classes/" + Class + "/infoBoxes/" + iBoxNeedUpd);
        get(infoRef).then((snapshot) => {
            if (snapshot.exists()) {
                const infoBoxData = snapshot.val();

                // Hiện thị thông tin trên giao diện người dùng
                const infoBoxElement = document.querySelectorAll(".InfoBox");
                if (infoBoxElement) {
                    infoBoxElement[iBoxNeedUpd - 1].innerHTML = `${infoBoxData.Info}`;
                } else {
                    console.error("Số lượng phần tử .InfoBox không phù hợp với số lượng dữ liệu trả về");
                }
            }
        }).catch((error) => {
            console.error('Lỗi khi tìm dữ liệu trong iBoxNeedUpd', error);
        });
    }
// ---------------------------------------------------------------------------------------------------------------
    

    function setInfoBox(course, Class, iBoxNeedUpd) {
        const infoRef = ref(db, "Courses/" + course + "/Classes/" + Class + "/infoBoxes/" + iBoxNeedUpd);
        var newInfo = document.querySelector("#InfoBox" + iBoxNeedUpd);
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