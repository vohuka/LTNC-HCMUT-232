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
// ---------------------------------Lấy giá trị của biến name từ trang login-------------------------------------------------
var urlParams = new URLSearchParams(window.location.search);
var userName = urlParams.get('userName');
var IDForSubject;
//-------------------------------------------Nhập thông tin giảng viên-------------------------------------------------------
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
    const userRef = ref(db, 'Teachers');

    get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            let userID = snapshot.val();

            for (let _email in userID) {
                if (userID[_email].Email === userName) {
                    // Cập nhật giá trị của từng thẻ <input> dựa trên dữ liệu từ Firebase
                    if (userID[_email].Name) document.querySelector('input[name="name"]').value = userID[_email].Name;
                    if (userID[_email].Birth) document.querySelector('input[name="dob"]').value = userID[_email].Birth;
                    if (userID[_email].Phone) document.querySelector('input[name="phone"]').value = userID[_email].Phone;
                    if (userID[_email].Email) document.querySelector('input[name="email"]').value = userID[_email].Email;
                    if (userID[_email].ID) {
                        document.querySelector('input[name="student_id"]').value = userID[_email].ID;
                        IDForSubject = userID[_email].ID;
                    }
                    if (userID[_email].hometown) document.querySelector('input[name="hometown"]').value = userID[_email].hometown;
                    if (userID[_email].specialize) document.querySelector('input[name="specialize"]').value = userID[_email].specialize;
                    if (userID[_email].degree) document.querySelector('input[name="degree"]').value = userID[_email].degree;
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
    get(ref(db, 'Teachers/')).then((snapshot) => {
        if(snapshot.exists())
        {
            let Login_Id = snapshot.val();
            for(let id in Login_Id){
                if(Login_Id[id].Email === userName)
                {
                    const studentRef = ref(db, 'Teachers/' + id);
                    
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

document.querySelector('.update-button').addEventListener('click', function() {
    // lấy giá trị người nhập
    const name = document.querySelector('input[name="name"]').value;
    const dob = document.querySelector('input[name="dob"]').value;
    const phone = document.querySelector('input[name="phone"]').value;
    const hometown = document.querySelector('input[name="hometown"]').value;
    const specialize = document.querySelector('input[name="specialize"]').value;
    const degree = document.querySelector('input[name="degree"]').value;

    // tạo đội tượng với dữ liệu
    const userData = {
        Name: name,
        Birth: dob,
        Phone: phone,
        hometown: hometown,
        specialize: specialize,
        degree: degree
    }

    saveDataToFirebase(userData);
    alert("Cập nhật thông tin thành công");
});

// -------------------------------------Nhập điểm + hiển thị thông tin sinh viên--------------------------------------------

var midTermExamGrade = document.querySelector("#Midterm_test");
var assignmentGrade = document.querySelector("#Assignment");
var finalExamGrade = document.querySelector("#Final_exam");

function setGrade(stuID, course) {
    //let newEmail = studentMail.replace(/\./g, '_');
    const studentRef = ref(db, "Student/" + stuID + "/Classes/" + course);
    
    get(studentRef).then((snapshot) => {
    if (snapshot.exists()) {
      // Merge existing data with updates
      const existingData = snapshot.val();
      const updatedData = {
        ...existingData,
        Midterm: midTermExamGrade.value,
        Assignment: assignmentGrade.value,
        Final: finalExamGrade.value,
        //Điểm tổng kết tính theo công thức 20% GK, 30% BTL, 50% CK
        Total: 0.2*midTermExamGrade.value + 0.3*assignmentGrade.value + 0.5*finalExamGrade.value,
    };

      // Update the entire object back to the database
      return set(studentRef, updatedData);
    } else {
      console.error("No data available to update.");
    }
  }).then(() => {
    alert('Cập nhật thông tin thành công');
    }).catch((error) => {
    console.error('Error updating data: ', error);
    });
}


function setGrade(stuID, course) {
    //let newEmail = studentMail.replace(/\./g, '_');
    const studentRef = ref(db, "Student/" + stuID + "/Classes/" + course);
    
    get(studentRef).then((snapshot) => {
    if (snapshot.exists()) {
      // Merge existing data with updates
      const existingData = snapshot.val();
      const updatedData = {
        ...existingData,
        Midterm: midTermExamGrade.value,
        Assignment: assignmentGrade.value,
        Final: finalExamGrade.value,
        //Điểm tổng kết tính theo công thức 20% GK, 30% BTL, 50% CK
        Total: 0.2*midTermExamGrade.value + 0.3*assignmentGrade.value + 0.5*finalExamGrade.value,
    };

      // Update the entire object back to the database
      return set(studentRef, updatedData);
    } else {
      console.error("No data available to update.");
    }
  }).then(() => {
    alert('Cập nhật thông tin thành công');
    }).catch((error) => {
    console.error('Error updating data: ', error);
    });
}




document.querySelector('.sidebarbox:nth-child(4)').addEventListener('click', function(event) {
    let userID = IDForSubject;
    var url = "Teacher_subject.html?IDForSubject=" + encodeURIComponent(userID);
    window.open(url, '_blank');
    event.preventDefault(); 
});
document.querySelector('.sidebarbox:nth-child(6)').addEventListener('click', function(event) {
    event.preventDefault(); 
    window.open('Register_subject_teacher.html', '_blank');
});

