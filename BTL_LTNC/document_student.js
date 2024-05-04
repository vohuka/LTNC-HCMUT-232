// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getDatabase, ref, update, set, get } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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
const db = getDatabase();

document.querySelector('.header-document .left button').addEventListener('click', function() {
  var content = document.querySelector('.table-document');
  if (content.style.maxHeight !== "0px"){
    content.style.maxHeight = "0px";
  } else {
    content.style.maxHeight = "100vh"; // or any large value
  } 
});

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

});


// -----------------------------Hàm hiển thị thông tin dặn dò (cần update)---------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const InfoBoxButtons = document.querySelectorAll('.InfoBoxDisplay');
  
  InfoBoxButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
          const course = 'CH1003';
          const Class = 'L1';
          const iBoxNeedUpd = index + 1; // Ví dụ: Lấy số thứ tự từ 1 đến n
          displayInfoBox(course, Class, iBoxNeedUpd);
      });
  });
});

function displayInfoBox(course, Class, iBoxNeedUpd) {
  const infoBoxRef = ref(db, "Courses/" + course + "/Classes/" + Class + "/infoBoxes/" + iBoxNeedUpd);
  
  // Lấy dữ liệu từ cơ sở dữ liệu Firebase
  get(infoBoxRef).then((snapshot) => {
      if (snapshot.exists()) {
          const infoBoxData = snapshot.val();
          // Hiển thị thông tin lên phần tử có lớp CSS InfoBoxDisplay tương ứng
          const infoBoxElement = document.querySelector('.mydocument:nth-child(' + (iBoxNeedUpd) + ') .InfoBoxDisplay');
          if (infoBoxElement) {
              infoBoxElement.innerText = infoBoxData.Info;
          } else {
              console.error("Không tìm thấy phần tử để hiển thị thông tin hộp thông tin.");
          }
      } else {
          console.error("Không tìm thấy dữ liệu hộp thông tin trong cơ sở dữ liệu.");
      }
  }).catch((error) => {
      console.error('Lỗi khi lấy dữ liệu hộp thông tin: ', error);
  });
}
displayInfoBox('CH1003', 'L1', '1');
// ----------------------------------------------------------------------------------------------------