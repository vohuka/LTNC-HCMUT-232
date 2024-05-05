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

// -----------------------------Giả sử bạn có 2 nút là 'Trang chủ' và 'Thông tin'---------------------------------
document.querySelector('.sidebarbox:nth-child(1)').addEventListener('click', function() {
    // Ẩn tất cả các trang
    document.querySelectorAll('.main_bar').forEach(page => {
        page.style.opacity = '0';
        page.style.display = 'none';
        page.classList.remove('active'); // Bỏ class 'active' nếu có
    });
    // Hiển thị trang chủ
    const generalPage = document.querySelector('.main_bar.general');
    generalPage.classList.add('active'); // Thêm class 'active'
    generalPage.style.display = 'grid'; // Sử dụng 'grid' thay vì 'block' vì CSS của bạn đã định nghĩa như vậy
    setTimeout(() => generalPage.style.opacity = '1', 10); // Thêm một delay nhỏ để transition có thể hoạt động
});
// ---------------------------------Lấy giá trị của biến name từ trang login----------------------------------------
var urlParams = new URLSearchParams(window.location.search);
var userName = urlParams.get('userName');
var IDForSubject;
// ----------------------------------click vào ô Thông tin-------------------------------------------------
document.querySelector('.sidebarbox:nth-child(2)').addEventListener('click', function() {
    // Ẩn tất cả các trang
    document.querySelectorAll('.main_bar').forEach(page => {
        page.style.opacity = '0';
        page.style.display = 'none';
        page.classList.remove('active'); // Bỏ class 'active' nếu có
    });
    // Hiển thị trang thông tin
    const infoPage = document.querySelector('.main_bar.info');
    infoPage.classList.add('active'); // Thêm class 'active'
    infoPage.style.display = 'block'; // Sử dụng 'grid' thay vì 'block'
    setTimeout(() => infoPage.style.opacity = '1', 10); // Thêm một delay nhỏ để transition có thể hoạt động
});

// Hiện thị thông tin sinh viên từ firebase nếu có sẵn
function checkEmailExists () {
    const db = getDatabase();
    const userRef = ref(db, 'Students');

    get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            let userID = snapshot.val();

            for (let perID in userID) {
                if (userID[perID].Email === userName) {
                    // Cập nhật giá trị của từng thẻ <input> dựa trên dữ liệu từ Firebase
                    if (userID[perID].Birth) document.querySelector('input[name="dob"]').value = userID[perID].Birth;
                    if (userID[perID].Phone) document.querySelector('input[name="phone"]').value = userID[perID].Phone;
                    if (userID[perID].Name) document.querySelector('input[name="name"]').value = userID[perID].Name;
                    if (userID[perID].Email) document.querySelector('input[name="email"]').value = userID[perID].Email;
                    if (userID[perID].ID) {
                        document.querySelector('input[name="student_id"]').value = userID[perID].ID;
                        IDForSubject = userID[perID].ID;
                    }
                    if (userID[perID].hometown) document.querySelector('input[name="hometown"]').value = userID[perID].hometown;
                    if (userID[perID].father_name) document.querySelector('input[name="father_name"]').value = userID[perID].father_name;
                    if (userID[perID].father_dob) document.querySelector('input[name="father_dob"]').value = userID[perID].father_dob;
                    if (userID[perID].father_job) document.querySelector('input[name="father_job"]').value = userID[perID].father_job;
                    if (userID[perID].mother_name) document.querySelector('input[name="mother_name"]').value = userID[perID].mother_name;
                    if (userID[perID].mother_dob) document.querySelector('input[name="mother_dob"]').value = userID[perID].mother_dob;
                    if (userID[perID].mother_job) document.querySelector('input[name="mother_job"]').value = userID[perID].mother_job;
                    if (userID[perID].parent_phone) document.querySelector('input[name="parent_phone"]').value = userID[perID].parent_phone;
                }
            }
        }
    }).catch((error) => {
        console.error(error);
    });
}
checkEmailExists();

// Hàm để lưu dữ liệu vào firebase
function saveDataToFirebase(data) {
    // lấy con trỏ đến database
    const db = getDatabase();
    get(ref(db, 'Students/')).then((snapshot) => {
        if(snapshot.exists())
        {
            let Login_Id = snapshot.val();
            for(let id in Login_Id){
                if(Login_Id[id].Email === userName)
                {
                    const studentRef = ref(db, 'Students/' + id);
                    
                    update(studentRef, data)
                    .then(() => {
                        console.log('Cập nhật thông tin thành công');
                    })
                    .catch((error) => {
                        if (error.code === 'PERMISSION_DENIED') {
                            set(studentRef, data);
                            console.log('Thêm thông tin thành công');
                        } else {
                            console.error('Error updating data: ', error);
                        }
                    });
                }
            }
        }

    });
}
// ----------------------------------------------------------------------------------------------------


document.querySelector('.update-button').addEventListener('click', function() {
    // lấy giá trị người nhập
    const Name = document.querySelector('input[name="name"]').value;
    const Birth = document.querySelector('input[name="dob"]').value;
    const Phone = document.querySelector('input[name="phone"]').value;
    const hometown = document.querySelector('input[name="hometown"]').value;
    const father_name = document.querySelector('input[name="father_name"]').value;
    const father_dob = document.querySelector('input[name="father_dob"]').value;
    const father_job = document.querySelector('input[name="father_job"]').value;
    const mother_name = document.querySelector('input[name="mother_name"]').value;
    const mother_dob = document.querySelector('input[name="mother_dob"]').value;
    const mother_job = document.querySelector('input[name="mother_job"]').value;
    const parent_phone = document.querySelector('input[name="parent_phone"]').value;

    // tạo đội tượng với dữ liệu
    const userData = {
        Name: Name,
        Birth: Birth,
        Phone: Phone,
        hometown: hometown,
        father_name: father_name,
        father_dob: father_dob,
        father_job: father_job,
        mother_name: mother_name,
        mother_dob: mother_dob,
        mother_job: mother_job,
        parent_phone: parent_phone,
    }

    saveDataToFirebase(userData);
    alert("Cập nhật thông tin thành công");
});

// ------------------------------------Hiển thị tên sinh viên-----------------------------------------
document.addEventListener('DOMContentLoaded', function () {

    const SubjectIDElement = document.getElementById('studentName');
    const userRef = ref(db, 'Students');
  
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
          let userID = snapshot.val();
  
        for (let perID in userID) {
          if (userID[perID].Email === userName) {
            SubjectIDElement.innerHTML = 'Họ tên: ' + userID[perID].Name.toUpperCase() + ' (' + userID[perID].ID + ')';
          }
        }
      }
    });
  });
// ---------------------------------------------------------------------------------------------------------------

// ------------------------------------Hiển thị điểm của sinh viên-----------------------------------------
function show_score() {// Tạo một hàng mới
    const userRef = ref(db, 'Students');
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
          let userID = snapshot.val();
            // Kiểm tra xem lấy email trong firebase
          for (let perID in userID) {
              if (userID[perID].Email === userName) {
                // lấy đường dẫn để lớp học khi đã biết của sinh viên nào
                const ClassRef = ref(db, 'Students/' + perID + '/Classes');
  
                get(ClassRef).then((snapshot) => {
                  const ClassName = snapshot.val();
                // vòng lặp dùng để lấy tên môn học
                  for (let classes in ClassName) {
                    const courseDir = ClassName[classes].CourseID;
                    const SubjectRef = ref(db, "Courses/" + courseDir + "/Course_Title"); // Đường dẫn đến tên môn học
                    get(SubjectRef).then((snapshot) => {
                      const Name_Of_Course = snapshot.val();
                      var newRow = document.createElement('tr');

                      // Thêm các cột vào hàng mới
                      var cell1 = document.createElement('td');
                      cell1.textContent = ClassName[classes].CourseID;
                      newRow.appendChild(cell1);

                      var cell2 = document.createElement('td');
                      cell2.textContent = Name_Of_Course;
                      newRow.appendChild(cell2);
                      
                      var cell3 = document.createElement('td');
                      if (ClassName[classes].Assignment != -1) {
                        cell3.textContent = ClassName[classes].Assignment;
                      } else {
                        cell3.textContent = 'Chưa có điểm';
                      }
                      newRow.appendChild(cell3);
                      
                      var cell4 = document.createElement('td');
                      if (ClassName[classes].Midterm != -1) {
                        cell4.textContent = ClassName[classes].Midterm;
                      } else {
                        cell4.textContent = 'Chưa có điểm';
                      }
                      newRow.appendChild(cell4);
                      
                      var cell5 = document.createElement('td');
                      if (ClassName[classes].Final != -1) {
                        cell5.textContent = ClassName[classes].Final;
                      } else {
                        cell5.textContent = 'Chưa có điểm';
                      }
                      newRow.appendChild(cell5);
                      
                      var cell6 = document.createElement('td');
                      var totalScore = 0;
                      if (ClassName[classes].Assignment != -1)  {
                        totalScore += ClassName[classes].Assignment * 0.3;
                      }
                      if (ClassName[classes].Midterm != -1)  {
                        totalScore += ClassName[classes].Midterm * 0.2;
                      }
                      if (ClassName[classes].Final != -1)  {
                        totalScore += ClassName[classes].Final * 0.5;
                      }
                      if (totalScore == 0) {
                        cell6.textContent = 'Chưa có điểm';
                      } else {
                        cell6.textContent = totalScore.toFixed(2);
                      }
                      newRow.appendChild(cell6);
                      
                      // Lấy thẻ tbody của bảng
                      var tbody = document.querySelector('.table-striped');
                      
                      // Chèn hàng mới vào trong tbody
                      tbody.appendChild(newRow);
                    });
                  }
                });
              }
          }
      }
  }).catch((error) => {
      console.error(error);
  });
}
// ---------------------------------------------------------------------------------------------------------------

// ------------------------------------Hiển thị thời khóa biểu của sinh viên-----------------------------------------
function show_schedule() {// Tạo một hàng mới
    const userRef = ref(db, 'Students');
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
          let userID = snapshot.val();
            // Kiểm tra xem lấy email trong firebase
          for (let perID in userID) {
              if (userID[perID].Email === userName) {
                // lấy đường dẫn để lớp học khi đã biết của sinh viên nào
                const ClassRef = ref(db, 'Students/' + perID + '/Classes');
  
                get(ClassRef).then((snapshot) => {
                  const ClassName = snapshot.val();
                // vòng lặp dùng để lấy tên môn học
                  for (let classes in ClassName) {
                    const courseDir = ClassName[classes].CourseID;
                    const SubjectRef = ref(db, "Courses/" + courseDir + "/Course_Title"); // Đường dẫn đến tên môn học
                    get(SubjectRef).then((snapshot) => {
                      const Name_Of_Course = snapshot.val();
                      var newRow = document.createElement('tr');
  
                      // Thêm các cột vào hàng mới
                      var cell1 = document.createElement('td');
                      cell1.textContent = ClassName[classes].CourseID;
                      newRow.appendChild(cell1);
  
                      var cell2 = document.createElement('td');
                      cell2.textContent = Name_Of_Course;
                      newRow.appendChild(cell2);
                      
                      var cell3 = document.createElement('td');
                      cell3.textContent = ClassName[classes].Day;
                      newRow.appendChild(cell3);
                      
                      var cell4 = document.createElement('td');
                      const timeToLearn = parseInt(ClassName[classes].Time) + 6;
                      cell4.textContent = timeToLearn + ':00 - ' + timeToLearn + ':50';
                      newRow.appendChild(cell4);
                      
                      var cell5 = document.createElement('td');
                      cell5.textContent = '|01|02|03|04|--|--|07|08|09|10|11|12|';
                      newRow.appendChild(cell5);
                      
                      // Lấy thẻ tbody của bảng
                      var tbody = document.querySelector('.table-schedule');
                      
                      // Chèn hàng mới vào trong tbody
                      tbody.appendChild(newRow);
                    });
                  }
                });
              }
          }
      }
  }).catch((error) => {
      console.error(error);
  });
}
// ---------------------------------------------------------------------------------------------------------------
  
document.querySelector('.sidebarbox:nth-child(3)').addEventListener('click', function(event) {
  event.preventDefault();
  // Ẩn tất cả các trang
  document.querySelectorAll('.main_bar').forEach(page => {
      page.style.opacity = '0';
      page.style.display = 'none';
      page.classList.remove('active'); // Bỏ class 'active' nếu có
  });
  // Hiển thị trang thông tin
  const infoPage = document.querySelector('.main_bar.score');
  infoPage.classList.add('active'); // Thêm class 'active'
  infoPage.style.display = 'block'; // Sử dụng 'grid' thay vì 'block'
  setTimeout(() => infoPage.style.opacity = '1', 10); // Thêm một delay nhỏ để transition có thể hoạt động
  show_score();
});


document.querySelector('.sidebarbox:nth-child(4)').addEventListener('click', function(event) {
  let userID = IDForSubject;
  var url = "Student_subject.html?IDForSubject=" + encodeURIComponent(userID);
  window.open(url, '_blank');
  event.preventDefault(); 
});

document.querySelector('.sidebarbox:nth-child(6)').addEventListener('click', function(event) {
    event.preventDefault(); 
    window.open('Register_subject_student.html', '_blank');
});

document.querySelector('.sidebarbox:nth-child(5)').addEventListener('click', function(event) {
  event.preventDefault();
  // Ẩn tất cả các trang
  document.querySelectorAll('.main_bar').forEach(page => {
      page.style.opacity = '0';
      page.style.display = 'none';
      page.classList.remove('active'); // Bỏ class 'active' nếu có
  });
  // Hiển thị trang thông tin
  const infoPage = document.querySelector('.main_bar.schedule');
  infoPage.classList.add('active'); // Thêm class 'active'
  infoPage.style.display = 'block'; // Sử dụng 'grid' thay vì 'block'
  setTimeout(() => infoPage.style.opacity = '1', 10); // Thêm một delay nhỏ để transition có thể hoạt động
  show_schedule();
});