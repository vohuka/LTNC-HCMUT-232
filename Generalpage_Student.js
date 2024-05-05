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
document.querySelector('.format_button:nth-child(1)').addEventListener('click', function() {
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
document.querySelector('.format_button:nth-child(2)').addEventListener('click', function() {
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

            for (let _email in userID) {
                if (userID[_email].Email === userName) {
                    // Cập nhật giá trị của từng thẻ <input> dựa trên dữ liệu từ Firebase
                    if (userID[_email].Birth) document.querySelector('input[name="dob"]').value = userID[_email].Birth;
                    if (userID[_email].Phone) document.querySelector('input[name="phone"]').value = userID[_email].Phone;
                    if (userID[_email].Name) document.querySelector('input[name="name"]').value = userID[_email].Name;
                    if (userID[_email].Email) document.querySelector('input[name="email"]').value = userID[_email].Email;
                    if (userID[_email].ID) {
                        document.querySelector('input[name="student_id"]').value = userID[_email].ID;
                        IDForSubject = userID[_email].ID;
                    }
                    if (userID[_email].hometown) document.querySelector('input[name="hometown"]').value = userID[_email].hometown;
                    if (userID[_email].father_name) document.querySelector('input[name="father_name"]').value = userID[_email].father_name;
                    if (userID[_email].father_dob) document.querySelector('input[name="father_dob"]').value = userID[_email].father_dob;
                    if (userID[_email].father_job) document.querySelector('input[name="father_job"]').value = userID[_email].father_job;
                    if (userID[_email].mother_name) document.querySelector('input[name="mother_name"]').value = userID[_email].mother_name;
                    if (userID[_email].mother_dob) document.querySelector('input[name="mother_dob"]').value = userID[_email].mother_dob;
                    if (userID[_email].mother_job) document.querySelector('input[name="mother_job"]').value = userID[_email].mother_job;
                    if (userID[_email].parent_phone) document.querySelector('input[name="parent_phone"]').value = userID[_email].parent_phone;
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

// ----------------------------------------------------------------------------------------------------



document.querySelector('.format_button:nth-child(4)').addEventListener('click', function(event) {
    let userID = IDForSubject;
    var url = "Student_subject.html?IDForSubject=" + encodeURIComponent(userID);
    window.open(url, '_blank');
    event.preventDefault(); 
});

document.querySelector('.format_button:nth-child(5)').addEventListener('click', function(event) {
    event.preventDefault(); 
    window.open('Register_subject_student.html', '_blank');
});