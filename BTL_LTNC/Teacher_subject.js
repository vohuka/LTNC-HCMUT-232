import { initializeApp }                     from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getDatabase, ref, child, get, set } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDx8uDOgXaLWzsR5H6autaHqmBoj-Q5m2U",
  authDomain: "ltnc-web.firebaseapp.com",
  databaseURL: "https://ltnc-web-default-rtdb.firebaseio.com",
  projectId: "ltnc-web",
  storageBucket: "ltnc-web.appspot.com",
  messagingSenderId: "819852901117",
  appId: "1:819852901117:web:84832bef50ef4b33e55c94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


//Biến global quan trọng
const db = getDatabase();

// ---------------------------------Lấy giá trị của ID từ trang student----------------------------------------
var urlParams = new URLSearchParams(window.location.search);
var IDForSubject = urlParams.get('IDForSubject');
// -----------------------------------------------------------------------------------------------------------------

const get_value = async (path) => {    //Lấy dữ liệu từ firebase lưu ý input đúng đường dẫn
    const Ref = ref(db, path);
    const snapshot = await get(Ref);
    return snapshot.val();
}

// Hàm tạo các thẻ div hiển thị khóa học
function get_class_for_student(stuID) {
    const classRef = ref(db, "Teachers/" + stuID + "/Classes");
    var classInfo_obj_array = [];
    get(classRef).then((snapshot) => {
        if(snapshot.exists()){
            let courseList = snapshot.val();
            for (let course_in_study in courseList) {
                // Lấy tên lớp học từ Firebase
                const parts = courseList[course_in_study].Class.split('/');
                const courseID = parts[1];
                const SubjectRef = ref(db,"Courses/" + courseID + "/Course_Title"); // Thêm db vào ref
                get(SubjectRef).then((snapshot) => { // Thay snapsho thành snapshot
                    const Subject_name = snapshot.val();
                    
                    // Tạo các phần tử HTML mới
                    var newDiv = document.createElement("div");
                    newDiv.className = "card dashboard";
                    var newImg = document.createElement("img");
                    newImg.className = "img";
                    newImg.src = "picture/Background 8.jpg";
                    var newDiv2 = document.createElement("div");
                    newDiv2.className = "string box-subject";
                    var newDiv3 = document.createElement("div");
                    newDiv3.className = "format-string";
                    var newP = document.createElement("p");
                    newP.textContent = courseID;
                    var newA = document.createElement("a");
                    newA.href = "#";
                    newA.id = Subject_name + '_' + courseList[course_in_study].ID;
                    newA.textContent = Subject_name + '_' + courseList[course_in_study].ID;
                    
                    // Khi nhấn vào thẻ A sẽ nhảy qua trang document
                    newA.addEventListener('click', function(event) {
                        event.preventDefault();
                        var courseID = classInfo_obj.courseID;
                        var classID = classInfo_obj.classID;
                        // Tạo url tương ứng
                        var url = "document_teacher.html?courseID=" + courseID + "&classID=" + classID;
                        window.location.href = url;
                    })

                    newDiv3.appendChild(newP);
                    newDiv3.appendChild(newA);
                    newDiv2.appendChild(newDiv3);
                    newDiv.appendChild(newImg);
                    newDiv.appendChild(newDiv2);
                    document.getElementById("newDiv").appendChild(newDiv);
                });
                
                // Tạo đối tượng classInfo_obj và thêm vào mảng
                let classInfo_obj = {
                    "courseID": courseID,
                    "classID": courseList[course_in_study].ID,
                };
                classInfo_obj_array.push(classInfo_obj);
            }
            // Trả về mảng classInfo_obj_array
            return classInfo_obj_array;
        } else {
            console.log("Không tìm thấy dữ liệu!");
            return classInfo_obj_array;
        }
    }).catch((error) => {
        console.error(error);
    });
}

// Gọi hàm và sử dụng kết quả
get_class_for_student(IDForSubject);